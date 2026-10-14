import { openNewTaskModal } from "./Forms/newTask.ts";
import "./Forms/newMember.ts";
import "./Forms/newProject.ts";

import { getIcon } from "./ui/icons/icons.ts";
import { onValue, ref } from "firebase/database";
import { db } from "./firebaseconfig.ts";

import { renderProjects } from "./renders/renderProjectsOverview.ts";
import { renderMembers } from "./renders/renderMembersOverview.ts";
import { renderDetailedProject } from "./renders/renderDetailedProject.ts";
import { renderScrumBoard } from "./renders/renderScrumBoard.ts";

import { Project } from "./classes/Project.ts";
import { Member } from "./classes/Member.ts";
import { Task } from "./classes/Task.ts";

import {
  categories as VALID_CATEGORIES,
  PRIORITIES,
  type Category,
  type Priority,
  type TaskStatus,
} from "./types/types.ts";

function updatePrioritySelectColor(): void {
  const prioritySelect = document.getElementById(
    "taskPrioritySelect"
  ) as HTMLSelectElement | null;
  if (!prioritySelect) return;

  if (prioritySelect.value === "") {
    prioritySelect.classList.add("text-slate-400");
    prioritySelect.classList.remove("text-slate-100");
  } else {
    prioritySelect.classList.add("text-slate-100");
    prioritySelect.classList.remove("text-slate-400");
  }
}

function initializeTaskFilterListeners(): void {
  const prioritySelect = document.getElementById("taskPrioritySelect");
  prioritySelect?.addEventListener("change", updatePrioritySelectColor);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTaskFilterListeners();
});

const overviewView = document.getElementById("overviewView") as HTMLElement;
const projectView = document.getElementById("projectView") as HTMLElement;
const backToOverviewBtn = document.getElementById(
  "backToOverviewBtn"
) as HTMLButtonElement;

let projects: Record<string, Project> = {};
let members: Record<string, Member> = {};
let tasks: Record<string, Task> = {};

let activeProjectId: string | null = null;

// BUTTONS
const newProjectButton = document.getElementById("newprojectbtn");
if (newProjectButton) {
  const plusIconProject = getIcon("plus");
  newProjectButton.prepend(plusIconProject);
}

const newMemberButton = document.getElementById("newmemberbtn");
if (newMemberButton) {
  const plusIconMember = getIcon("plus");
  newMemberButton.prepend(plusIconMember);
}

const newTaskButton = document.getElementById("newtaskbtn");
if (newTaskButton) {
  const plusIconTask = getIcon("plus");
  newTaskButton.prepend(plusIconTask);

  newTaskButton.addEventListener("click", () => {
    if (activeProjectId) {
      openNewTaskModal(activeProjectId);
    }
  });
}

// FIREBASE REFS
const projectsRef = ref(db, "projects");
const membersRef = ref(db, "members");
const tasksRef = ref(db, "tasks");

const VALID_PRIORITIES: Priority[] =
  (PRIORITIES as Priority[]) || [
    "low",
    "moderate",
    "high",
    "critical",
    "Low",
    "Moderate",
    "High",
    "Critical",
  ];

const createTaskFromFirebase = (id: string, data: any): Task => {
  const safePriority: Priority = (VALID_PRIORITIES as string[]).includes(
    data.priority
  )
    ? data.priority
    : "Low";

  const safeCategory: Category = (
    VALID_CATEGORIES as readonly string[]
  ).includes(data.category)
    ? (data.category as Category)
    : "Frontend Development";

  const task = new Task(
    id,
    data.title?.trim() || "Untitled Task",
    data.description?.trim() || "No description provided.",
    safeCategory,
    safePriority,
    data.deadline || new Date().toISOString().split("T")[0],
    data.projectId ?? data.projektId ?? ""
  );

  task.created = data.created || new Date().toISOString();
  task.status = (data.status ?? "new") as TaskStatus;
  task.assignedTo = data.assignedTo || null;
  task.completedAt = data.completedAt || null;

  return task;
};

// OPEN PROJECT
function openProject(projectId: string) {
  const project = projects[projectId];
  if (!project) return;

  overviewView?.classList.add("hidden");
  projectView?.classList.remove("hidden");

  activeProjectId = projectId;

  renderDetailedProject(project, members, tasks);
  renderScrumBoard(project, members, tasks);
}

// RENDER ACTIVE PROJECT
function renderProject() {
  if (!activeProjectId) return;

  const project = projects[activeProjectId];
  if (!project) return;

  renderDetailedProject(project, members, tasks);
  renderScrumBoard(project, members, tasks);
}

// BACK TO OVERVIEW
backToOverviewBtn.addEventListener("click", () => {
  activeProjectId = null;
  projectView.classList.add("hidden");
  overviewView.classList.remove("hidden");
});

// FIREBASE - PROJECTS
onValue(projectsRef, (snapshot) => {
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
      ),
    ])
  );

  renderProjects(projects, openProject);
  renderMembers(members, projects);
  renderProject();
});

// FIREBASE - MEMBERS
onValue(membersRef, (snapshot) => {
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
      ),
    ])
  );

  renderMembers(members, projects);
  renderProject();
});

// FIREBASE - TASKS
onValue(tasksRef, (snapshot) => {
  const data = snapshot.val() ?? {};

  tasks = Object.fromEntries(
    Object.entries(data).map(([id, taskData]) => [
      id,
      createTaskFromFirebase(id, taskData),
    ])
  );

  renderProject();
});