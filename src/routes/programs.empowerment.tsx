import { createFileRoute } from "@tanstack/react-router";
import { ProgramDetail } from "@/components/ProgramDetail";

export const Route = createFileRoute("/programs/empowerment")({
  head: () => ({
    meta: [
      { title: "Empowerment Program — Eagle's Wings Empowerment" },
      {
        name: "description",
        content: "Vocational training, mentorship, and micro-grants for women and youth.",
      },
    ],
  }),
  component: () => <ProgramDetail slug="empowerment" />,
});
