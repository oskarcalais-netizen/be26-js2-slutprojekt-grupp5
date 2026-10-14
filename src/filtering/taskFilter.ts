import type { Priority, TaskSortBy } from "../types/types";
import { compareDates } from "../utils/formatDate";

export interface TaskFilterOptions {
  title?: string;
  priority?: Priority;
  assignedMemberId?: string;
  category?: string;
  sortBy?: TaskSortBy;
  sortOrder?: "asc" | "desc";
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

const PRIORITY_WEIGHTS: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

export function filterAndSortTasks(
  tasks: TaskItem[],
  options: TaskFilterOptions
): TaskItem[] {
  const {
    title,
    priority,
    assignedMemberId,
    category,
    sortBy = "createdAt",
    sortOrder = "asc",
  } = options;

  const filteredTasks = tasks.filter((task) => {
    if (title && !task.title.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }
    if (priority && task.priority.toLowerCase() !== priority.toLowerCase()) {
      return false;
    }
    if (assignedMemberId && task.assignedMemberId !== assignedMemberId) {
      return false;
    }
    if (category && task.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    return true;
  });

  return [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "title":
        comparison = (a.title || "").localeCompare(b.title || "");
        break;

      case "priority": {
        const weightA = PRIORITY_WEIGHTS[(a.priority || "").toLowerCase()] || 0;
        const weightB = PRIORITY_WEIGHTS[(b.priority || "").toLowerCase()] || 0;
        comparison = weightA - weightB;
        break;
      }

      case "assignedMember":
        comparison = (a.assignedMemberName || "").localeCompare(
          b.assignedMemberName || ""
        );
        break;

      case "category":
        comparison = (a.category || "").localeCompare(b.category || "");
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