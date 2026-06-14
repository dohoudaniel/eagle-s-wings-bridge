import { createFileRoute } from "@tanstack/react-router";
import { ProgramDetail } from "@/components/ProgramDetail";

export const Route = createFileRoute("/programs/elderly-care")({
  head: () => ({
    meta: [
      { title: "Elderly Care Program — Eagle's Wings Empowerment" },
      {
        name: "description",
        content:
          "Daily meals, medical visits, and companionship for elderly individuals living alone.",
      },
    ],
  }),
  component: () => <ProgramDetail slug="elderly-care" />,
});
