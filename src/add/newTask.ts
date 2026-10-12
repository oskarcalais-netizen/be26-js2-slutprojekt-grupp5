import { ref, push, update, get } from "firebase/database";
import { db } from "../firebaseconfig";
import type { Category, Priority } from "../types/types";

const dialog = document.createElement("dialog");
dialog.className =
  "rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl backdrop:bg-slate-950/80 max-w-md w-full";

dialog.innerHTML = `
  <form id="newTaskForm" method="dialog" class="flex flex-col gap-4">
    <h3 class="text-xl font-bold text-slate-100">Create New Task</h3>
    
    <div>
      <label class="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
      <input
        type="text"
        id="newTaskTitle"
        required
        placeholder="Enter task title..."
        class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
      <textarea
        id="newTaskDescription"
        rows="3"
        placeholder="Enter task description..."
        class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Category</label>
        <select
          id="newTaskCategory"
          class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="UX">UX</option>
          <option value="DevOps">DevOps</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Priority</label>
        <select
          id="newTaskPriority"
          class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-1">Deadline</label>
      <input
        type="date"
        id="newTaskDeadline"
        required
        class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <p id="newTaskErrorMessage" class="text-xs text-red-400 hidden"></p>

    <div class="mt-2 flex justify-end gap-3">
      <button
        type="button"
        id="cancelNewTaskBtn"
        class="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
      >
        Cancel
      </button>

      <button
        type="submit"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
      >
        Create Task
      </button>
    </div>
  </form>
`;

document.body.appendChild(dialog);

let currentProjectId: string | null = null;

export const openNewTaskModal = (projectId: string) => {
  currentProjectId = projectId;
  const form = dialog.querySelector("#newTaskForm") as HTMLFormElement;
  const errorMessage = dialog.querySelector("#newTaskErrorMessage") as HTMLParagraphElement;
  
  form.reset();
  errorMessage.classList.add("hidden");
  dialog.showModal();
};

const cancelBtn = dialog.querySelector("#cancelNewTaskBtn") as HTMLButtonElement;
cancelBtn.addEventListener("click", () => {
  dialog.close();
});

const form = dialog.querySelector("#newTaskForm") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titleInput = dialog.querySelector("#newTaskTitle") as HTMLInputElement;
  const descriptionInput = dialog.querySelector("#newTaskDescription") as HTMLTextAreaElement;
  const categorySelect = dialog.querySelector("#newTaskCategory") as HTMLSelectElement;
  const prioritySelect = dialog.querySelector("#newTaskPriority") as HTMLSelectElement;
  const deadlineInput = dialog.querySelector("#newTaskDeadline") as HTMLInputElement;
  const errorMessage = dialog.querySelector("#newTaskErrorMessage") as HTMLParagraphElement;

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categorySelect.value as Category;
  const priority = prioritySelect.value as Priority;
  const deadline = deadlineInput.value;

  if (!title) {
    errorMessage.textContent = "Task title cannot be empty.";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!deadline) {
    errorMessage.textContent = "Please select a valid deadline date.";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!currentProjectId) {
    errorMessage.textContent = "No active project selected.";
    errorMessage.classList.remove("hidden");
    return;
  }

  try {
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    const taskId = newTaskRef.key;

    if (!taskId) {
      throw new Error("Could not generate task ID.");
    }

    const newTaskData = {
      title,
      description,
      category,
      priority,
      deadline,
      projectId: currentProjectId,
      status: "new",
      created: new Date().toISOString(),
      assignedTo: null,
      completedAt: null,
    };

    // Fetches existing tasks for active project
    const projectTasksRef = ref(db, `projects/${currentProjectId}/tasks`);
    const snapshot = await get(projectTasksRef);
    const existingTasks: string[] = snapshot.exists() ? snapshot.val() : [];

    // Atomic multi-path update in Firebase
    const updates: Record<string, any> = {};
    updates[`/tasks/${taskId}`] = newTaskData;
    updates[`/projects/${currentProjectId}/tasks`] = [...existingTasks, taskId];

    await update(ref(db), updates);
    dialog.close();
  } catch (error) {
    errorMessage.textContent = "Failed to save task to database. Try again.";
    errorMessage.classList.remove("hidden");
  }
});