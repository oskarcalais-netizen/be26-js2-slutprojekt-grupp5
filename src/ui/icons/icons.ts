import { createElement, Plus, Trash2, Edit, icons } from "lucide";

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