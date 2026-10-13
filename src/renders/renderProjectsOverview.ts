import { filterAndSortProjects, type ProjectFilterOptions, type ProjectItem } from '../filtering/projectFilter.ts';
import type { Project } from "../classes/Project.ts";
import {getDeadlineInfo} from "../utils/getDeadlineInfo.ts"

let cachedProjects: Record<string, Project> = {};
let cachedOnProjectClick: ((projectId: string) => void) | null = null;

const projectsContainer = document.querySelector("#projectList") as HTMLElement;
const projectSearchInput = document.querySelector("#projectSearchInput") as HTMLInputElement;
const projectSortBySelect = document.querySelector("#projectSortBySelect") as HTMLSelectElement;
const projectSortOrderSelect = document.querySelector("#projectSortOrderSelect") as HTMLSelectElement;

export const renderProjects = (projects: Record<string, Project>, onProjectClick: (projectId: string) => void) => {
    cachedProjects = projects;
    cachedOnProjectClick = onProjectClick;

    projectsContainer.innerHTML = "";

    const projectArray: ProjectItem[] = Object.entries(projects).map(([id, project]) => ({
        ...project,
        id: project.id || id,
        createdAt: (project as any).createdAt || new Date(0)
    }));

    const filterOptions: ProjectFilterOptions = {
        title: projectSearchInput?.value.trim(),
        sortBy: projectSortBySelect?.value as 'title' | 'deadline' | 'createdAt',
        sortOrder: projectSortOrderSelect?.value as 'asc' | 'desc',
    };

    const filteredProjects = filterAndSortProjects(projectArray, filterOptions);

    filteredProjects.forEach((project) => {
       const projectId = project.id;
       const deadlineStr = typeof project.deadline === 'string' 
           ? project.deadline 
           : project.deadline instanceof Date 
               ? project.deadline.toISOString() 
               : String(project.deadline ?? '');
       const deadlineInfo = getDeadlineInfo(deadlineStr);

       const projectListContainer = document.createElement("article");
       projectListContainer.className =
    "rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:-translate-y-1 hover:border-indigo-500 hover:shadow-indigo-500/10 cursor-pointer";

       projectListContainer.addEventListener("click", () => {
           onProjectClick(projectId);
       });

       const projectTitleEl = document.createElement("h4");
       projectTitleEl.textContent = project.title;
       projectTitleEl.className =
    "mb-2 text-xl font-bold text-slate-100";

       const projectDescriptionEl = document.createElement("p");
       projectDescriptionEl.textContent = project.description;
       projectDescriptionEl.className =
    "mb-5 text-sm leading-6 text-slate-400";
       
       const projectMembersEl = document.createElement("p");
       projectMembersEl.textContent = `Members: ${project.members ? project.members.length : 0}`;
       projectMembersEl.className =
    "mb-2 text-sm text-slate-300";
       
       const projectTasksEl = document.createElement("p");
       projectTasksEl.textContent = `Tasks: ${project.tasks ? project.tasks.length : 0}`;
       projectTasksEl.className =
    "mb-2 text-sm text-slate-300";

       const projectDeadlineEl = document.createElement("p");
       projectDeadlineEl.textContent = deadlineInfo.text;
       projectDeadlineEl.className = `mt-4 border-t border-slate-700 pt-4 text-sm font-semibold ${deadlineInfo.colorClass}`;

       projectListContainer.append(
           projectTitleEl,
           projectDescriptionEl,
           projectMembersEl,
           projectTasksEl,
           projectDeadlineEl
       );

       projectsContainer.appendChild(projectListContainer);
    });
};

function triggerProjectFilter() {
    if (cachedProjects && cachedOnProjectClick) {
        renderProjects(cachedProjects, cachedOnProjectClick);
    }
}

projectSearchInput?.addEventListener("input", triggerProjectFilter);
projectSortBySelect?.addEventListener("change", triggerProjectFilter);
projectSortOrderSelect?.addEventListener("change", triggerProjectFilter);