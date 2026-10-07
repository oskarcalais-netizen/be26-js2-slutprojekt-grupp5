//För testning av Firebase Realtime Database
//Dessa "funktioner" används för att hämta data från Firebase och eventuella uppdateringar hämtas i realtid.
import "./buttons/newMember.ts";
import "./buttons/newProject.ts";

import { onValue, ref } from "firebase/database";

import { db } from "./firebaseconfig.ts";
import { renderProjects } from "./renders/renderProjects.ts";
import { renderMembers } from "./renders/renderMembers.ts";

import { createElement, icons } from "lucide";

const newProjectButton = document.getElementById("newprojectbtn");

const plusIconProject = createElement(icons.Plus);

newProjectButton?.prepend(plusIconProject);

const newMemberButton = document.getElementById("newmemberbtn");

const plusIconMember = createElement(icons.Plus);

newMemberButton?.prepend(plusIconMember);

const projectsRef = ref(db, "projects");
const membersRef = ref(db, "members");
const tasksRef = ref(db, "tasks");

onValue(projectsRef, (snapshot) => {
  const projects = snapshot.val();

  renderProjects(projects);
});

onValue(membersRef, (snapshot) => {
  const members = snapshot.val();
  renderMembers(members);
});

onValue(tasksRef, (snapshot) => {
  const tasks = snapshot.val();
  console.log(tasks);
});
