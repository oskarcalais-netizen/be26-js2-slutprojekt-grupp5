export type Category =
  | "UI/UX Design"
  | "Backend Development"
  | "QA"
  | "Git Administration"
  | "Frontend Development"
  | "Database Management";

export type Priority =
  | "low" | "Low"
  | "moderate" | "Moderate"
  | "high" | "High"
  | "critical" | "Critical";

  export const PRIORITIES: Priority[] = ["Low", "Moderate", "High", "Critical"];

export type TaskStatus = "new" | "in-progress" | "in-review" | "completed";

export const categories: Category[] = [
  "UI/UX Design",
  "Backend Development",
  "QA",
  "Git Administration",
  "Frontend Development",
  "Database Management",
];

export type TaskSortBy = 'title' | 'priority' | 'assignedMember' | 'category' | 'deadline' | 'createdAt';

export interface TaskFilterOptions {
  title?: string;
  priority?: Priority;
  assignedMemberId?: string;
  category?: string;
  sortBy?: TaskSortBy;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskItem {
  id: string;
  title: string;
  priority: Priority;
  assignedMemberId?: string;
  assignedMemberName?: string;
  category: string;
  deadline: string | Date;
  createdAt: string | Date;
  [key: string]: any;
}