import handler from "../dist/server/server.js";

export const config = {
  runtime: "nodejs",
};

// Vercel's Node.js runtime invokes this with Node's (req, res). The TanStack
// Start SSR bundle exposes a web-standard `fetch(Request) -> Response`, so we
// bridge the two. If Vercel ever calls us in web-handler mode (no `res`), we
// forward the Request straight through.
export default async function (req, res) {
  if (!res) {
    return handler.fetch(req);
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${proto}://${host}${req.url}`;

  const method = req.method || "GET";
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else if (value != null) headers.set(key, value);
  }

  let body;
  if (method !== "GET" && method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const response = await handler.fetch(new Request(url, { method, headers, body }));

  res.statusCode = response.status;
  // Preserve multiple Set-Cookie headers (Headers.forEach folds them into one).
  const setCookie =
    typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : null;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });
  if (setCookie && setCookie.length) res.setHeader("set-cookie", setCookie);

  res.end(Buffer.from(await response.arrayBuffer()));
}
