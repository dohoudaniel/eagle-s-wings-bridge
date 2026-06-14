import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export const Route = createFileRoute("/donate/verify")({
  head: () => ({
    meta: [{ title: "Confirming Donation — Eagle's Wings Empowerment" }],
  }),
  component: DonateVerifyPage,
});

function DonateVerifyPage() {
  const { reference } = useSearch({ from: "/donate/verify" }) as { reference?: string };
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setError("No payment reference found.");
      return;
    }
    api
      .verifyDonation(reference)
      .then((data) => {
        if (data.status === "completed") {
          setStatus("success");
          setAmount(data.amount.toLocaleString());
          setCurrency(data.currency);
        } else {
          setStatus("failed");
          setError("Payment was not completed. Please try again.");
        }
      })
      .catch((err) => {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Verification failed.");
      });
  }, [reference]);

  return (
    <>
      <PageHeader
        eyebrow="Donation"
        title={status === "success" ? "Thank you" : "Confirming payment"}
        description={
          status === "success"
            ? "Your generosity is already making a difference."
            : "We're finalizing your transaction."
        }
      />

      <section className="py-20 text-center">
        <div className="container mx-auto px-4 max-w-xl">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-6 text-muted-foreground">Confirming your donation...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto h-20 w-20 rounded-full bg-success/15 grid place-items-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Payment confirmed</h2>
              <p className="mt-2 text-muted-foreground">
                {currency} {amount} received. A receipt has been sent to your email.
              </p>
              <Button asChild className="mt-8">
                <Link to="/">Return home</Link>
              </Button>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="mx-auto h-20 w-20 rounded-full bg-red-100 grid place-items-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Payment not completed</h2>
              <p className="mt-2 text-muted-foreground">{error || "Something went wrong."}</p>
              <Button asChild variant="outline" className="mt-8">
                <Link to="/donate">Try again</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </>
  );
}
