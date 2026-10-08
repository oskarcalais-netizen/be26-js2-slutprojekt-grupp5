import type { Project } from "../classes/Project.ts";
import {getDeadlineInfo} from "../utils/deadlines.ts"

const projectsContainer = document.getElementById("projectList") as HTMLDivElement;


export const renderProjects = (projects: Record<string, Project>, onProjectClick: (projectId: string) => void) => {
    projectsContainer.innerHTML = "";

    
    Object.entries(projects).forEach(([projectId, project]) => {

       const deadlineInfo = getDeadlineInfo(project.deadline);

        const projectListContainer = document.createElement("article") as HTMLElement;
       projectListContainer.className =
    "rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:-translate-y-1 hover:border-indigo-500 hover:shadow-indigo-500/10";

        const projectTitleEl = document.createElement("h4") as HTMLHeadElement;
        projectTitleEl.textContent = project.title;
        projectTitleEl.className =
    "mb-2 text-xl font-bold text-slate-100";

        const projectDescriptionEl = document.createElement("p") as HTMLParagraphElement;
        projectDescriptionEl.textContent = project.description;
        projectDescriptionEl.className =
    "mb-5 text-sm leading-6 text-slate-400";
        
        const projectMembersEl = document.createElement("p") as HTMLParagraphElement;
        projectMembersEl.textContent = `Members: ${project.members.length}`;
        projectMembersEl.className =
    "mb-2 text-sm text-slate-300";
       
    
        const projectTasksEl = document.createElement("p") as HTMLParagraphElement;
        projectTasksEl.textContent = `Tasks: ${project.tasks.length}`;
        projectTasksEl.className =
    "mb-2 text-sm text-slate-300";

        const projectDeadlineEl = document.createElement("p") as HTMLParagraphElement;
        projectDeadlineEl.textContent = `Deadline: ${deadlineInfo.formattedDeadline} · ${deadlineInfo.deadlineText}`;
       
        switch (deadlineInfo.deadlineStatus) {
    case "overdue":
        projectDeadlineEl.className =
            "mt-4 border-t border-slate-700 pt-4 text-sm font-medium text-red-400";
        break;

    case "today":
        projectDeadlineEl.className =
            "mt-4 border-t border-slate-700 pt-4 text-sm font-medium text-orange-400";
        break;

    case "soon":
        projectDeadlineEl.className =
            "mt-4 border-t border-slate-700 pt-4 text-sm font-medium text-yellow-400";
        break;

    case "normal":
        projectDeadlineEl.className =
            "mt-4 border-t border-slate-700 pt-4 text-sm font-medium text-green-400";
        break;
}


projectListContainer.addEventListener(
    "click",
    () => {
        onProjectClick(projectId);
       
    }
);
       


        projectListContainer.append(
            projectTitleEl,
            projectDescriptionEl,
            projectMembersEl,
            projectTasksEl,
            projectDeadlineEl
        );

        projectsContainer.append(projectListContainer)

    });



}