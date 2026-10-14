import type { ProjectItem, ProjectFilterOptions } from "../types/types";
import { compareDates } from "../utils/formatDate";

export function filterAndSortProjects(
  projects: ProjectItem[],
  options: ProjectFilterOptions
): ProjectItem[] {
  const { title, sortBy = "createdAt", sortOrder = "asc" } = options;

  const filteredProjects = projects.filter((project) => {
    if (title && !project.title.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }
    return true;
  });

  return filteredProjects.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "title":
        comparison = (a.title || "").localeCompare(b.title || "");
        break;
      case "deadline":
        comparison = compareDates(a.deadline, b.deadline);
        break;
      case "createdAt":
        comparison = compareDates(a.createdAt, b.createdAt);
        break;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
}