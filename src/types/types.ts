export type Category =
  | "UI/UX Designer"
  | "Backend Engineer"
  | "QA manager"
  | "Git admin"
  | "Frontend Developer"
  | "Database manager";

export type Priority = "low" | "moderate" | "high" | "critical";

export type TaskStatus = "new" | "in-progress" | "in-review" | "completed";

export const categories: Category[] = [
  "UI/UX Designer",
  "Backend Engineer",
  "QA manager",
  "Git admin",
  "Frontend Developer",
  "Database manager",
];
