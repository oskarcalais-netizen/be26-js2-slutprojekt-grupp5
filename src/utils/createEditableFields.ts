import { ref, update } from "firebase/database";
import type { Task } from "../classes/Task";
import { db } from "../firebaseconfig";


export const createEditableFields = (task: Task) => {
  const wrapper = document.createElement("div");
  wrapper.className = "mt-4 space-y-4";

  const deadlineLabel = document.createElement("label");
  deadlineLabel.textContent = "Deadline";
  deadlineLabel.htmlFor = `deadline-${task.id}`;

  deadlineLabel.className =
    "block text-sm font-medium text-slate-300";

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

  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority";
  priorityLabel.className =
    "block text-sm font-medium text-slate-300";

  const prioritySelect = document.createElement("select");
  prioritySelect.className =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";

  const priorities = ["low", "moderate", "high", "critical"];

  priorities.forEach(priority => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    option.selected = task.priority === priority;
    prioritySelect.appendChild(option);
  });

  priorityLabel.appendChild(prioritySelect);

  prioritySelect.addEventListener("change", async () => {
    try {
      await update(ref(db, `tasks/${task.id}`), {
        priority: prioritySelect.value,
      });
    } catch (error) {
      console.error("Could not update priority:", error);
      alert("Kunde inte uppdatera prioritet.");
    }
  });

  wrapper.append(deadlineLabel, priorityLabel);

  return wrapper;
};