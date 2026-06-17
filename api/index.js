import handler from "../dist/server/server.js";

export const config = {
  runtime: "nodejs20.x",
};

export default async function (request) {
  return handler.fetch(request);
}
