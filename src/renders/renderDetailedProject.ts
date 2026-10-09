import type { Member } from "../classes/Member";
import type { Project } from "../classes/Project";
import type { Task } from "../classes/Task";

import { renderNewTask } from "./scrumboard/renderNewTasks.ts";

const projectDetails = document.getElementById("projectDetails") as HTMLDivElement;

const projectMembers = document.getElementById("projectMembers") as HTMLDivElement;




export const renderDetailedProject = (
    project: Project,
    members: Record<string, Member>,
    tasks: Record<string, Task>
) => {


    // PROJECT DETAILS
    
    projectDetails.innerHTML = "";
    projectDetails.className= "display flex flex-col gap-4 justify-center items-center"

    const projectTitleEl =
        document.createElement("h2");

    projectTitleEl.textContent =
        project.title;

    projectTitleEl.className =
        "text-3xl font-bold text-slate-100";


    const projectDescriptionEl =
        document.createElement("p");

    projectDescriptionEl.textContent =
        project.description;

    projectDescriptionEl.className =
        "mt-3 text-slate-400";

    const projectDeadlineEl = document.createElement("p");

    projectDeadlineEl.textContent =
        `Deadline: ${project.deadline}`;

    projectDeadlineEl.className =
        "text-sm text-slate-400";


    projectDetails.append(
        projectTitleEl,
        projectDescriptionEl,
        projectDeadlineEl
    );


    // MEMBERS
  
    projectMembers.innerHTML = "";

    project.members.forEach((memberId) => {

        const member = members[memberId];

        if (!member) {
            return;
        }


        const memberCard =
            document.createElement("article");

        memberCard.className =
            "rounded-xl border border-slate-700 bg-slate-800 p-5";


        const memberNameEl =
            document.createElement("h4");

        memberNameEl.textContent = member.name;

        memberNameEl.className =
            "text-lg font-bold text-slate-100";


        const memberCategoryEl =
            document.createElement("p");

        memberCategoryEl.textContent =
            `Categories: ${member.categories.join(", ")}`;

        memberCategoryEl.className =
            "mt-2 text-sm text-slate-400";


        const activeTasks = member.ongoingTasks.filter(taskTitle =>
    project.tasks.some(taskId => {
        const task = tasks[taskId];
        return task && task.title === taskTitle;
    })
).length;


        const taskCount =
            document.createElement("p");

        taskCount.textContent =
            `Ongoing tasks: ${activeTasks}`;

        taskCount.className =
            "mt-2 text-sm text-indigo-400";


        memberCard.append(
            memberNameEl,
            memberCategoryEl,
            taskCount
        );

        projectMembers.appendChild(
            memberCard
        );

    });

// TASKS

const newTasks =
    document.getElementById("newTasks") as HTMLDivElement;

const inProgressTasks =
    document.getElementById("inProgressTasks") as HTMLDivElement;

const inReviewTasks =
    document.getElementById("inReviewTasks") as HTMLDivElement;

const completedTasks =
    document.getElementById("completedTasks") as HTMLDivElement;

newTasks.innerHTML = "";
inProgressTasks.innerHTML = "";
inReviewTasks.innerHTML = "";
completedTasks.innerHTML = "";


project.tasks.forEach((taskId) => {

    const task = tasks[taskId];

    if (!task) {
        return;
    }


    if (task.status === "new") {

        const taskCard =
            renderNewTask(
                task,
                project,
                members
            );

        newTasks.appendChild(taskCard);
    }


    else if (task.status === "in-progress" ) {

        const taskCard =
            document.createElement("article");

        taskCard.className =
            "mb-3 rounded-xl border border-slate-700 bg-slate-800 p-5";

        const taskTitle =
            document.createElement("h4");

        taskTitle.textContent =
            task.title;

        taskTitle.className =
            "text-lg font-bold text-slate-100";

        const taskStatus =
            document.createElement("p");

        taskStatus.textContent =
            `Status: ${task.status}`;

        taskStatus.className =
            "mt-2 text-sm text-slate-400";

        taskCard.append(
            taskTitle,
            taskStatus
        );

        inProgressTasks.appendChild(taskCard);
    }
    else if (task.status === "in-review" ) {

        const taskCard =
            document.createElement("article");

        taskCard.className =
            "mb-3 rounded-xl border border-slate-700 bg-slate-800 p-5";

        const taskTitle =
            document.createElement("h4");

        taskTitle.textContent =
            task.title;

        taskTitle.className =
            "text-lg font-bold text-slate-100";

        const taskStatus =
            document.createElement("p");

        taskStatus.textContent =
            `Status: ${task.status}`;

        taskStatus.className =
            "mt-2 text-sm text-slate-400";

        taskCard.append(
            taskTitle,
            taskStatus
        );

        inReviewTasks.appendChild(taskCard);
    }


    else if (task.status === "completed") {

        const taskCard =
            document.createElement("article");

        taskCard.className =
            "mb-3 rounded-xl border border-slate-700 bg-slate-800 p-5";

        const taskTitle =
            document.createElement("h4");

        taskTitle.textContent =
            task.title;

        taskTitle.className =
            "text-lg font-bold text-slate-100";

        const taskStatus =
            document.createElement("p");

        taskStatus.textContent =
            `Status: ${task.status}`;

        taskStatus.className =
            "mt-2 text-sm text-slate-400";

        taskCard.append(
            taskTitle,
            taskStatus
        );

        completedTasks.appendChild(taskCard);
    }

});
 
}

