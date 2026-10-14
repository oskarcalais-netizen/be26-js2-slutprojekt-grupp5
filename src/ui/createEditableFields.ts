import { ref, update } from "firebase/database";
import type { Task } from "../classes/Task";
import { db } from "../firebaseconfig";
import { PRIORITIES, type Priority } from "../types/types";
import { getPriorityBadge } from "./icons/icons";

export const createEditableFields = (task: Task) => {
  const wrapper = document.createElement("div");
  wrapper.className = "mt-4 space-y-4";

  // DEADLINE
  const deadlineLabel = document.createElement("label");
  deadlineLabel.textContent = "Deadline";
  deadlineLabel.htmlFor = `deadline-${task.id}`;
  deadlineLabel.className = "block text-sm font-medium text-slate-300";

  const deadlineInput = document.createElement("input");
  deadlineInput.type = "date";
  deadlineInput.value = task.deadline ?? "";
  deadlineInput.id = `deadline-${task.id}`;
  deadlineInput.className =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";

  deadlineLabel.appendChild(deadlineInput);

  deadlineInput.addEventListener("change", async () => {
    try {
      await update(ref(db, `tasks/${task.id}`), {
        deadline: deadlineInput.value,
      });
    } catch (error) {
      console.error("Could not update deadline:", error);
      alert("Kunde inte uppdatera deadline.");
    }
  });

  // PRIORITY
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority";
  priorityLabel.className = "block text-sm font-medium text-slate-300";

  const prioritySelect = document.createElement("select");
  prioritySelect.className =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";

  // Fyll rullistan med de centrala prioriteringsalternativen ("Low", "Moderate", "High", "Critical")
  PRIORITIES.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;

    if (task.priority && task.priority.toLowerCase() === priority.toLowerCase()) {
      option.selected = true;
    }

    prioritySelect.appendChild(option);
  });

  priorityLabel.appendChild(prioritySelect);

  // EVENT LISTENER FOR PRIORITY CHANGES
  prioritySelect.addEventListener("change", async () => {
    const newPriority = prioritySelect.value as Priority;

    // 1. UPDATE EMOJI DIRECTLY IN DOM (card)
    const taskCard = wrapper.closest("article");
    if (taskCard) {
      const priorityEmojiEl = taskCard.querySelector(".priority-emoji");
      if (priorityEmojiEl) {
        const updatedBadge = getPriorityBadge(newPriority);
        priorityEmojiEl.textContent = updatedBadge.emoji;
      }
    }

    // 2. SAVE TO FIREBASE
    try {
      await update(ref(db, `tasks/${task.id}`), {
        priority: newPriority,
      });
    } catch (error) {
      console.error("Could not update priority:", error);
      alert("Kunde inte uppdatera prioritet.");
    }
  });

  wrapper.append(deadlineLabel, priorityLabel);

  return wrapper;
};