import { Suspense } from "react";
import { ProjectLibrary } from "@/app/projects/project-library";

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <ProjectLibrary />
    </Suspense>
  );
}
