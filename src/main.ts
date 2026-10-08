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