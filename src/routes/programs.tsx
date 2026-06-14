import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Eagle's Wings Empowerment" },
      {
        name: "description",
        content:
          "Explore our impact areas: motherless homes, elderly care, and empowerment programs for women and youth.",
      },
    ],
  }),
  component: ProgramsLayout,
});

function ProgramsLayout() {
  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Programs that restore dignity."
        description="Three core areas. One mission: to meet people where they are and walk with them toward what's possible."
      />
      <Outlet />
    </>
  );
}
