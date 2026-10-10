//För testning av Firebase Realtime Database
//Dessa "funktioner" används för att hämta data från Firebase och eventuella uppdateringar hämtas i realtid.
import "./buttons/newMember.ts";
import "./buttons/newProject.ts";

import { createElement, icons } from "lucide";

import { onValue, ref } from "firebase/database";

import { db } from "./firebaseconfig.ts";

import { renderProjects } from "./renders/renderProjects.ts";
import { renderMembers } from "./renders/renderMembers.ts";
import { renderDetailedProject } from "./renders/renderDetailedProject.ts"
import {renderScrumBoard } from "./renders/renderScrumBoard.ts"

import { Project } from "./classes/Project.ts";
import { Member } from "./classes/Member.ts";
import { Task } from "./classes/Task.ts";

import type {
    Category,
    Priority,
    TaskStatus
} from "./types/types.ts";

import { filterAndSortProjects } from './filtering/projectFilter';
import type { ProjectFilterOptions, ProjectItem } from './filtering/projectFilter';
import { filterAndSortTasks } from './filtering/taskFilter';
import type { TaskFilterOptions, TaskItem } from './filtering/taskFilter';

let rawProjects: ProjectItem[] = []; // <-- Placeholder: Load actual project data
let rawTasks: TaskItem[] = []; // <-- Placeholder: Load actual tasks data for active project

function getProjectFilterState(): ProjectFilterOptions {
  const searchInput = document.getElementById('projectSearchInput') as HTMLInputElement;
  const sortBySelect = document.getElementById('projectSortBySelect') as HTMLSelectElement;
  const sortOrderSelect = document.getElementById('projectSortOrderSelect') as HTMLSelectElement;

  return {
    title: searchInput?.value || undefined,
    sortBy: (sortBySelect?.value as ProjectFilterOptions['sortBy']) || 'createdAt',
    sortOrder: (sortOrderSelect?.value as ProjectFilterOptions['sortOrder']) || 'asc'
  };
}

function updateAndRenderProjects(): void {
  const options = getProjectFilterState();
  const filteredProjects = filterAndSortProjects(rawProjects, options);
  
  renderProjectsList(filteredProjects); // <-- Placeholder: Call rendering function
}

function getTaskFilterState(): TaskFilterOptions {
  const searchInput = document.getElementById('taskSearchInput') as HTMLInputElement;
  const prioritySelect = document.getElementById('taskPrioritySelect') as HTMLSelectElement;
  const sortBySelect = document.getElementById('taskSortBySelect') as HTMLSelectElement;
  const sortOrderSelect = document.getElementById('taskSortOrderSelect') as HTMLSelectElement;

  return {
    title: searchInput?.value || undefined,
    priority: prioritySelect?.value ? (prioritySelect.value as TaskFilterOptions['priority']) : undefined,
    sortBy: (sortBySelect?.value as TaskFilterOptions['sortBy']) || 'createdAt',
    sortOrder: (sortOrderSelect?.value as TaskFilterOptions['sortOrder']) || 'asc'
  };
}

function updateAndRenderTasks(): void {
  const options = getTaskFilterState();
  const filteredTasks = filterAndSortTasks(rawTasks, options);
  
  renderScrumBoardTasks(filteredTasks); // <-- Placeholder: Call rendering function
}

function initializeProjectFilterListeners(): void {
  const searchInput = document.getElementById('projectSearchInput');
  const sortBySelect = document.getElementById('projectSortBySelect');
  const sortOrderSelect = document.getElementById('projectSortOrderSelect');

  searchInput?.addEventListener('input', updateAndRenderProjects);
  sortBySelect?.addEventListener('change', updateAndRenderProjects);
  sortOrderSelect?.addEventListener('change', updateAndRenderProjects);
}

function updatePrioritySelectColor(): void {
  const prioritySelect = document.getElementById('taskPrioritySelect') as HTMLSelectElement | null;
  if (!prioritySelect) return;

  if (prioritySelect.value === '') {
    prioritySelect.classList.add('text-slate-400');
    prioritySelect.classList.remove('text-slate-100');
  } else {
    prioritySelect.classList.add('text-slate-100');
    prioritySelect.classList.remove('text-slate-400');
  }
}

function initializeTaskFilterListeners(): void {
  const prioritySelect = document.getElementById('taskPrioritySelect');

  prioritySelect?.addEventListener('change', () => {
    updatePrioritySelectColor();
    updateAndRenderTasks();
  });

  // <-- Placeholder: Add remaining task filter event listeners here
}

function renderProjectsList(_projects: ProjectItem[]): void {
  // <-- Placeholder: Insert rendering logic to populate #projectList
}

function renderScrumBoardTasks(_tasks: TaskItem[]): void {
  // <-- Placeholder: Insert rendering logic to populate #newTasks, #inProgressTasks, etc.
}

document.addEventListener('DOMContentLoaded', () => {
  initializeProjectFilterListeners();
  initializeTaskFilterListeners();
});

const overviewView =
    document.getElementById("overviewView") as HTMLElement;

const projectView =
    document.getElementById("projectView") as HTMLElement;

const backToOverviewBtn =
    document.getElementById("backToOverviewBtn") as HTMLButtonElement;


let projects: Record<string, Project> = {};
let members: Record<string, Member> = {};
let tasks: Record<string, Task> = {};

let activeProjectId:string | null = null;

// BUTTON ICONS

const newProjectButton =
    document.getElementById("newprojectbtn");

if (newProjectButton) {
    const plusIconProject =
        createElement(icons.Plus);

    newProjectButton.prepend(
        plusIconProject
    );
}

const newMemberButton =
    document.getElementById("newmemberbtn");

if (newMemberButton) {
    const plusIconMember =
        createElement(icons.Plus);

    newMemberButton.prepend(
        plusIconMember
    );
}


//Firebase
const projectsRef = ref(db, "projects");
const membersRef = ref(db, "members");
const tasksRef = ref(db, "tasks");



const createTaskFromFirebase = (
    id: string,
    data: any
): Task => {
    const task =
        new Task(
            id,
            data.title ?? "",
            data.description ?? "",
            data.category as Category,
            data.priority as Priority,
            data.deadline ?? "",
            data.projectId ?? data.projektId ?? ""
        );

    task.created =
        data.created ??
        new Date().toISOString();

    task.status =
        (data.status ?? "new") as TaskStatus;

    task.assignedTo =
        data.assignedTo;

    task.completedAt =
        data.completedAt;

    return task;
};


// OPEN PROJECT

function openProject(projectId: string) {
    
    const project = projects[projectId];
    
    if (!project) {
        return;
    }
    
    overviewView?.classList.add("hidden");
    
    projectView?.classList.remove("hidden");
    
    renderDetailedProject(
    project,
    members,
    tasks
);
}

// RENDER ACTIVE PROJECT

function renderProject() {
    if (!activeProjectId) {
        return;
    }

    const project =
        projects[activeProjectId];

    if (!project) {
        return;
    }

    renderDetailedProject(
        project,
        members,
        tasks
    );

    renderScrumBoard(
        project,
        members,
        tasks
    );
}


// BACK TO OVERVIEW



backToOverviewBtn.addEventListener("click", () => {

    activeProjectId = null;

    
    projectView.classList.add("hidden");
    overviewView.classList.remove("hidden");
    
});




// FIREBASE - PROJECTS
onValue(projectsRef, snapshot => {

     const data = snapshot.val() ?? {};
    
       projects = Object.fromEntries(
        Object.entries(data).map(([id, projectData]: [string, any]) => [
            id,
            new Project(
                id,
                projectData.title,
                projectData.description,
                projectData.deadline,
                projectData.members ?? [],
                projectData.tasks ?? []
            )
        ])
    );

    renderProjects(projects, openProject)

     renderProject();  
})

// FIREBASE - MEMBERS
onValue(membersRef, snapshot => {

     const data = snapshot.val() ?? {};

       members = Object.fromEntries(
        Object.entries(data).map(([id, memberData]: [string, any]) => [
            id,
            new Member(
                id,
                memberData.name,
                memberData.categories ?? [],
                memberData.ongoingTasks ?? [],
                memberData.projects ?? []
            )
        ])
    );
    
     renderMembers(members)

   
renderProject();

            
});

// FIREBASE - TASKS
onValue(
    tasksRef,
    (snapshot) => {
        const data =
            snapshot.val() ?? {};

        tasks =
            Object.fromEntries(
                Object.entries(data).map(
                    ([id, taskData]) => [
                        id,
                        createTaskFromFirebase(
                            id,
                            taskData
                        )
                    ]
                )
            );

        console.log(tasks);

        renderProject();
    }
);