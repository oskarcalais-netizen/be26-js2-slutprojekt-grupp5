import type { Task } from "../classes/Task";
import { formatDate } from "../utils/formatDate";
import { getDeadlineInfo } from "../utils/getDeadlineInfo";
import { getPriorityBadge } from "../ui/icons/icons";

export const createBaseTaskCard = (task: Task) => {
  const taskCard = document.createElement("article");
  taskCard.className =
    "relative rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg flex flex-col gap-2";

    // 1. PRIORITY INDICATOR (Upper left corner)
  const priorityBadge = getPriorityBadge(task.priority);

  const headerContainer = document.createElement("div");
  headerContainer.className = "flex items-center gap-2";

  const priorityEmojiEl = document.createElement("span");
  priorityEmojiEl.textContent = priorityBadge.emoji;
  priorityEmojiEl.className = "priority-emoji text-base leading-none";

  const taskTitle = document.createElement("h5");
  taskTitle.textContent = task.title;
  taskTitle.className = "text-lg font-bold text-slate-100";

  headerContainer.append(priorityEmojiEl, taskTitle);

  // 3. DESCRIPTION
  const taskDescription = document.createElement("p");
  taskDescription.textContent = task.description;
  taskDescription.className = "text-sm leading-5 text-slate-400";

  // 4. CATEGORY
  const taskCategory = document.createElement("p");
  taskCategory.textContent = `Category: ${task.category}`;
  taskCategory.className = "mt-1 text-sm text-indigo-400";

  // 5. DATE CREATED
  const createdTaskDate = document.createElement("p");
  createdTaskDate.textContent = `Created: ${formatDate(task.created)}`;
  createdTaskDate.className = "text-sm text-slate-500";

  // 6. COLOR CODED DEADLINE TEXT (same as project cards)
  const deadlineStr = typeof task.deadline === 'string' ? task.deadline : String(task.deadline ?? '');
  const deadlineInfo = getDeadlineInfo(deadlineStr);
  
  const taskDeadlineEl = document.createElement("p");
  taskDeadlineEl.textContent = deadlineInfo.text;
  taskDeadlineEl.className = `mt-3 border-t border-slate-700 pt-3 text-sm font-semibold ${deadlineInfo.colorClass}`;

  taskCard.append(
    headerContainer,
    taskDescription,
    taskCategory,
    createdTaskDate,
    taskDeadlineEl
  );

  return taskCard;
};