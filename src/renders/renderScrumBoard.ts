import type { Member } from "../classes/Member.ts";
import type { Project } from "../classes/Project.ts";
import type { Task } from "../classes/Task.ts";
import { filterAndSortTasks } from "../filtering/taskFilter.ts";
import type { TaskFilterOptions, Priority, TaskSortBy, TaskItem } from "../types/types.ts";

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

const getVisibleProjectTasks = (
  project: Project,
  tasks: Record<string, Task>,
  members: Record<string, Member>,
  filterOptions: TaskFilterOptions
): TaskItem[] => {
  const projectTasks = project.tasks
    .map((taskId) => tasks[taskId])
    .filter((task): task is Task => task !== undefined);

  const tasksForFiltering: TaskItem[] = projectTasks.map((t) => ({
    ...t,
    assignedMemberId: t.assignedTo || "",
    assignedMemberName: t.assignedTo ? members[t.assignedTo]?.name : undefined,
    createdAt: t.created || new Date(0).toISOString(),
  }));

  return filterAndSortTasks(tasksForFiltering, filterOptions);
};

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

  const projectMembers: Record<string, Member> = {
  ...members,
};

    const filterOptions: TaskFilterOptions = {
    title: taskSearchInput?.value.trim(),
    priority: (taskPrioritySelect?.value || undefined) as Priority | undefined,
    sortBy: (taskSortBySelect?.value || "createdAt") as TaskSortBy,
    sortOrder: (taskSortOrderSelect?.value || "asc") as "asc" | "desc",
  };

  const filteredTasks = getVisibleProjectTasks(project, tasks, members, filterOptions);

  filteredTasks.forEach((taskItem) => {
    const task = tasks[taskItem.id] || (taskItem as unknown as Task);
    switch (task.status) {
      case "new":
        newTasksContainer.appendChild(
          renderNewTaskColumn(task, project, projectMembers)
        );
        break;

      case "in-progress":
        inProgressTasksContainer.appendChild(
          renderInProgressTaskColumn(task, projectMembers)
        );
        break;

      case "in-review":
        inReviewTasksContainer.appendChild(
          renderInReviewTaskColumn(task, projectMembers)
        );
        break;

      case "completed":
        completedTasksContainer.appendChild(
          renderCompletedTaskColumn(task, project, projectMembers)
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