import type { Member } from "../classes/Member.ts";
import type { Project } from "../classes/Project.ts";
import type { Task } from "../classes/Task.ts";
import { filterAndSortTasks, type TaskFilterOptions, type PriorityLevel } from "../filtering/taskFilter.ts";



import {
  renderNewTaskColumn,
  renderInProgressTaskColumn,
  renderInReviewTaskColumn,
  renderCompletedTaskColumn,
} from "./renderScrumBoardColumns.ts";

let cachedProject: Project | null = null;
let cachedMembers: Record<string, Member> = {};
let cachedTasks: Record<string, Task> = {};

const newTasksContainer = document.getElementById("newTasks") as HTMLDivElement;
const inProgressTasksContainer = document.getElementById("inProgressTasks") as HTMLDivElement;
const inReviewTasksContainer = document.getElementById("inReviewTasks") as HTMLDivElement;
const completedTasksContainer = document.getElementById("completedTasks") as HTMLDivElement;

const taskSearchInput = document.querySelector("#taskSearchInput") as HTMLInputElement;
const taskPrioritySelect = document.querySelector("#taskPrioritySelect") as HTMLSelectElement;
const taskSortBySelect = document.querySelector("#taskSortBySelect") as HTMLSelectElement;
const taskSortOrderSelect = document.querySelector("#taskSortOrderSelect") as HTMLSelectElement;

export const renderScrumBoard = (
  project: Project,
  members: Record<string, Member>,
  tasks: Record<string, Task>
) => {
  cachedProject = project;
  cachedMembers = members;
  cachedTasks = tasks;

  newTasksContainer.innerHTML = "";
  inProgressTasksContainer.innerHTML = "";
  inReviewTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";

  const projectTasks = project.tasks
    .map(taskId => tasks[taskId])
    .filter((task): task is Task => task !== undefined);

  const filterOptions: TaskFilterOptions = {
    title: taskSearchInput?.value.trim(),
    priority: (taskPrioritySelect?.value || undefined) as PriorityLevel | undefined,
    sortBy: (taskSortBySelect?.value || 'createdAt') as any,
    sortOrder: (taskSortOrderSelect?.value || 'asc') as 'asc' | 'desc',
  };

  const tasksForFiltering = projectTasks.map(t => ({
    ...t,
    assignedMemberName: t.assignedTo ? members[t.assignedTo]?.name : undefined,
    createdAt: (t as any).createdAt || new Date(0)
  }));

  const filteredTasks = filterAndSortTasks(tasksForFiltering as any, filterOptions);

  filteredTasks.forEach(taskItem => {
    const task = tasks[taskItem.id] || (taskItem as unknown as Task);
    switch (task.status) {
      case "new":
        newTasksContainer.appendChild(
          renderNewTaskColumn(task, project, members)
        );
        break;

      case "in-progress":
        inProgressTasksContainer.appendChild(
          renderInProgressTaskColumn(task, members)
        );
        break;

      case "in-review":
        inReviewTasksContainer.appendChild(
          renderInReviewTaskColumn(task, members)
        );
        break;

      case "completed":
        completedTasksContainer.appendChild(
          renderCompletedTaskColumn(task, project, members)
        );
        break;
    }
  });
};

function triggerTaskFilter() {
  if (taskPrioritySelect) {
    if (taskPrioritySelect.value === "") {
      taskPrioritySelect.classList.add("text-slate-400");
      taskPrioritySelect.classList.remove("text-slate-100");
    } else {
      taskPrioritySelect.classList.add("text-slate-100");
      taskPrioritySelect.classList.remove("text-slate-400");
    }
  }

  if (cachedProject) {
    renderScrumBoard(cachedProject, cachedMembers, cachedTasks);
  }
}

taskSearchInput?.addEventListener("input", triggerTaskFilter);
taskPrioritySelect?.addEventListener("change", triggerTaskFilter);
taskSortBySelect?.addEventListener("change", triggerTaskFilter);
taskSortOrderSelect?.addEventListener("change", triggerTaskFilter);