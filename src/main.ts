//För testning av Firebase Realtime Database
//Dessa "funktioner" används för att hämta data från Firebase och eventuella uppdateringar hämtas i realtid.
import "./buttons/newMember.ts";
import "./buttons/newProject.ts";

import { onValue, ref } from "firebase/database";

import { db } from "./firebaseconfig.ts";
import { renderProjects } from "./renders/renderProjects.ts";
import { renderMembers } from "./renders/renderMembers.ts";
import { renderDetailedProject } from "./renders/renderDetailedProject.ts"

import { createElement, icons } from "lucide";


const overviewView =
    document.getElementById("overviewView") as HTMLElement;

const projectView =
    document.getElementById("projectView") as HTMLElement;

const backToOverviewBtn =
    document.getElementById("backToOverviewBtn") as HTMLButtonElement;


let projects = {};
let members = {};
let tasks = {};

//Sätta inkoner med Lucide för knapparna för ny medlem och projekt
const newProjectButton = document.getElementById("newprojectbtn");

const plusIconProject = createElement(icons.Plus);

newProjectButton?.prepend(plusIconProject);

const newMemberButton = document.getElementById("newmemberbtn");

const plusIconMember = createElement(icons.Plus);

newMemberButton?.prepend(plusIconMember);


//Firebase
const projectsRef = ref(db, "projects");
const membersRef = ref(db, "members");
const tasksRef = ref(db, "tasks");


//Öppna projekt

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

//Tillbaka till Overview
backToOverviewBtn.addEventListener("click", () => {
    
    projectView.classList.add("hidden");
    overviewView.classList.remove("hidden");
    
});


//Firebase projects
onValue(projectsRef, snapshot => {
     projects = snapshot.val() ?? {};
    
    renderProjects(projects, openProject)
})

//Firebase members
onValue(membersRef, snapshot => {
     members = snapshot.val() ?? {};
    renderMembers(members)
});

//Firebase tasks
onValue(tasksRef, snapshot => {
    tasks = snapshot.val() ?? {};
    console.log(tasks);
})