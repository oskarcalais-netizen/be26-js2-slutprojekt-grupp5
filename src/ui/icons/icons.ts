import { createElement, Plus, Trash2, Edit, icons } from "lucide";
import type { Priority } from "../../types/types";

export type IconName = "plus" | "delete" | "edit";

export const getIcon = (name: IconName): SVGElement => {
  switch (name) {
    case "plus":
      return createElement(Plus);
    case "delete":
      return createElement(Trash2);
    case "edit":
      return createElement(Edit);
    default:
      return createElement(icons.HelpCircle);
  }
};

export const getPriorityBadge = (priority: Priority): { emoji: string; colorClass: string } => {
  switch (priority) {
    case "critical":
      return { emoji: "🔴", colorClass: "text-red-500" };
    case "high":
      return { emoji: "🟠", colorClass: "text-orange-400" };
    case "moderate":
      return { emoji: "🟡", colorClass: "text-amber-400" };
    case "low":
    default:
      return { emoji: "🟢", colorClass: "text-emerald-400" };
  }
};