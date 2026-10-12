import type { Member } from "../classes/Member.ts";
import type { Project } from "../classes/Project.ts";
import type { Task } from "../classes/Task.ts";



import {
  renderNewTaskColumn,
  renderInProgressTaskColumn,
  renderInReviewTaskColumn,
  renderCompletedTaskColumn,
} from "./renderScrumBoardColumns.ts";

const newTasksContainer = document.getElementById("newTasks") as HTMLDivElement;
const inProgressTasksContainer = document.getElementById("inProgressTasks") as HTMLDivElement;
const inReviewTasksContainer = document.getElementById("inReviewTasks") as HTMLDivElement;
const completedTasksContainer = document.getElementById("completedTasks") as HTMLDivElement;



export const renderScrumBoard = (
  project: Project,
  members: Record<string, Member>,
  tasks: Record<string, Task>
) => {
  newTasksContainer.innerHTML = "";
  inProgressTasksContainer.innerHTML = "";
  inReviewTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";

  const projectTasks = project.tasks
    .map(taskId => tasks[taskId])
    .filter((task): task is Task => task !== undefined);

  projectTasks.forEach(task => {
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
