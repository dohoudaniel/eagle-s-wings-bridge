import { createFileRoute } from "@tanstack/react-router";
import { ProgramDetail } from "@/components/ProgramDetail";

export const Route = createFileRoute("/programs/motherless-home")({
  head: () => ({
    meta: [
      { title: "Motherless Homes Program — Eagle's Wings Empowerment" },
      {
        name: "description",
        content:
          "We give vulnerable children in Nigeria shelter, education, and a family that loves them.",
      },
    ],
  }),
  component: () => <ProgramDetail slug="motherless-home" />,
});
