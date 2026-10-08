import type { Member } from "../classes/Member.ts";
import type { Project } from "../classes/Project.ts";
import type { Task } from "../classes/Task.ts";

import { renderNewTask} from "./scrumboard/renderNewTasks.ts";

const newTasksContainer = document.getElementById("newTasks") as HTMLDivElement;
const inProgressTasksContainer = document.getElementById("inProgressTasks") as HTMLDivElement;
const completedTasksContainer = document.getElementById("completedTasks") as HTMLDivElement;

const newTaskCount = document.getElementById("newTaskCount") as HTMLSpanElement;
const inProgressTaskCount = document.getElementById("inProgressTaskCount") as HTMLSpanElement;
const completedTaskCount = document.getElementById("completedTaskCount") as HTMLSpanElement;


const createSimpleTaskCard = (task: Task) => {
    const card = document.createElement("article");

    card.className =
        "rounded-xl border border-slate-700 bg-slate-800 p-5";

    const title =
        document.createElement("h5");

    title.textContent = task.title;

    title.className =
        "text-lg font-bold text-slate-100";

    const description =
        document.createElement("p");

    description.textContent =
        task.description;

    description.className =
        "mt-2 text-sm text-slate-400";

    const priority =
        document.createElement("p");

    priority.textContent =
        `Priority: ${task.priority}`;

    priority.className =
        "mt-3 text-sm text-indigo-400";

    card.append(
        title,
        description,
        priority
    );

    return card;
};

export const renderScrumBoard = (
    project: Project,
    members: Record<string, Member>,
    tasks: Record<string, Task>
) => {
    newTasksContainer.innerHTML = "";
    inProgressTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    const projectTasks =
        project.taskIds
            .map((taskId) => tasks[taskId])
            .filter(
                (task): task is Task =>
                    task !== undefined
            );

    const newTasks =
        projectTasks.filter(
            (task) => task.status === "new"
        );

    const inProgressTasks =
        projectTasks.filter(
            (task) => task.status === "in-progress"
        );

    const completedTasks =
        projectTasks.filter(
            (task) => task.status === "completed"
        );

    newTaskCount.textContent =
        String(newTasks.length);

    inProgressTaskCount.textContent =
        String(inProgressTasks.length);

    completedTaskCount.textContent =
        String(completedTasks.length);

    newTasks.forEach((task) => {
        newTasksContainer.appendChild(
            renderNewTask(
                task,
                project,
                members
            )
        );
    });

    inProgressTasks.forEach((task) => {
        inProgressTasksContainer.appendChild(
            createSimpleTaskCard(task)
        );
    });

    completedTasks.forEach((task) => {
        completedTasksContainer.appendChild(
            createSimpleTaskCard(task)
        );
    });
};
