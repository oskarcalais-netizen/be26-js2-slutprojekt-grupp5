import { ref, push, update, get } from "firebase/database";
import { db } from "../firebaseconfig";
import { categories, type Category, type Priority } from "../types/types";

let currentProjectId: string | null = null;
let taskIsSaving = false;

const taskContainer = document.querySelector(
  "#taskContainer",
) as HTMLDivElement;

// Visar formuläret och kopplar knapparna till sina funktioner.
export function openNewTaskModal(projectId: string) {
  if (taskIsSaving === true) {
    return;
  }

  currentProjectId = projectId;

  taskContainer.innerHTML = `
    <div class="formOverlay">
      <div class="formBox newTaskBox">
        <h2>New task</h2>

        <label for="newTaskTitle">Title</label>
        <input id="newTaskTitle" type="text" placeholder="Enter a title" />

        <label for="newTaskDescription">Description</label>
        <textarea
          id="newTaskDescription"
          placeholder="Describe the task"
        ></textarea>

        <label for="newTaskCategory">Category</label>
        <select id="newTaskCategory">
          <option value="" disabled selected>Choose a category</option>
        </select>

        <label for="newTaskPriority">Priority</label>
        <select id="newTaskPriority">
          <option value="" disabled selected>Choose a priority</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <label for="newTaskDeadline">Deadline</label>
        <input id="newTaskDeadline" type="date" required />

        <p id="newTaskErrorMessage" aria-live="polite"></p>

        <button id="addTaskBtn" type="button">Add task</button>
        <button id="closeTaskBtn" type="button">Close</button>
      </div>
    </div>`;

  const categorySelect = document.querySelector(
    "#newTaskCategory",
  ) as HTMLSelectElement;

  // Skapar ett alternativ för varje kategori i types.ts
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");

    option.value = categories[i];
    option.textContent = categories[i];

    categorySelect.appendChild(option);
  }

  const closeTaskBtn = document.querySelector(
    "#closeTaskBtn",
  ) as HTMLButtonElement;

  closeTaskBtn.addEventListener("click", closeTaskBox);

  const addTaskBtn = document.querySelector("#addTaskBtn") as HTMLButtonElement;

  addTaskBtn.addEventListener("click", checkTask);
}

// Stänger formuläret när ingen sparning pågår.
function closeTaskBox() {
  if (taskIsSaving === true) {
    return;
  }

  taskContainer.innerHTML = "";
  currentProjectId = null;
}

// Stänger formuläret om användaren klickar på bakgrunden.
taskContainer.addEventListener("click", (event) => {
  const background = taskContainer.querySelector(".formOverlay");

  if (event.target === background) {
    closeTaskBox();
  }
});

// Kontrollerar fälten innan uppgiften sparas.
function checkTask() {
  if (taskIsSaving === true) {
    return;
  }

  const titleInput = document.querySelector(
    "#newTaskTitle",
  ) as HTMLInputElement;

  const descriptionInput = document.querySelector(
    "#newTaskDescription",
  ) as HTMLTextAreaElement;

  const categoryInput = document.querySelector(
    "#newTaskCategory",
  ) as HTMLSelectElement;

  const priorityInput = document.querySelector(
    "#newTaskPriority",
  ) as HTMLSelectElement;

  const deadlineInput = document.querySelector(
    "#newTaskDeadline",
  ) as HTMLInputElement;

  const message = document.querySelector(
    "#newTaskErrorMessage",
  ) as HTMLParagraphElement;

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categoryInput.value;
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;

  message.textContent = "";

  if (title === "") {
    message.textContent = "Enter a title.";
    return;
  }

  if (description === "") {
    message.textContent = "Enter a description.";
    return;
  }

  let categoryIsValid = false;

  // Checks that the category exists in types.ts
  for (let i = 0; i < categories.length; i++) {
    if (category === categories[i]) {
      categoryIsValid = true;
    }
  }

  if (categoryIsValid === false) {
    message.textContent = "Choose an existing category.";
    return;
  }

  let priorityIsValid = false;

  if (priority === "low") {
    priorityIsValid = true;
  }

  if (priority === "moderate") {
    priorityIsValid = true;
  }

  if (priority === "high") {
    priorityIsValid = true;
  }

  if (priority === "critical") {
    priorityIsValid = true;
  }

  if (priorityIsValid === false) {
    message.textContent = "Choose a priority.";
    return;
  }

  if (deadline === "") {
    message.textContent = "Choose a deadline.";
    return;
  }

  if (currentProjectId === null) {
    message.textContent = "Open a project before adding a task.";
    return;
  }

  saveTask(
    title,
    description,
    category as Category,
    priority as Priority,
    deadline,
    currentProjectId,
  );
}

// Saves the task and links it to the open project.
async function saveTask(
  title: string,
  description: string,
  category: Category,
  priority: Priority,
  deadline: string,
  projectId: string,
) {
  const errorMessage = document.querySelector(
    "#newTaskErrorMessage",
  ) as HTMLParagraphElement;

  const addTaskBtn = document.querySelector("#addTaskBtn") as HTMLButtonElement;

  taskIsSaving = true;
  addTaskBtn.disabled = true;

  errorMessage.textContent = "Saving task...";

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
      projectId,
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
    taskIsSaving = false;
    closeTaskBox();
  } catch {
    errorMessage.textContent = "Failed to save task to database. Try again.";
  }

  // Resets the button if saving failed.
  if (taskIsSaving === true) {
    taskIsSaving = false;
    addTaskBtn.disabled = false;
  }
}
