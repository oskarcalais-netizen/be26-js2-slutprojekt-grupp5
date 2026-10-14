import { ref, update } from "firebase/database";
import type { Member } from "../classes/Member";
import type { Project } from "../classes/Project";
import type { Task } from "../classes/Task";
import { db } from "../firebaseconfig";


export const createMemberSelection = (task: Task, project: Project, members: Record<string, Member>)=> {
    const memberWrapperEl = document.createElement("div");

    memberWrapperEl.className = "mt-4";

    const memberLabelEl = document.createElement("label");

    memberLabelEl.textContent = "Assign member";

    memberLabelEl.className = "block text-sm font-medium text-slate-300";

    const memberSelectEl = document.createElement("select");

    memberSelectEl.className = "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "Select member";

    memberSelectEl.appendChild(defaultOption);

   Object.values(members).forEach((member) => {
    // SHOWS ONLY MEMBERS WITH MATCHING CATEGORY
    if (!member.categories.includes(task.category)) {
        return;
    }

    const option = document.createElement("option");

    option.value = member.id;
    option.textContent = member.name;

    if (task.assignedTo === member.id) {
        option.selected = true;
    }

    memberSelectEl.appendChild(option);
});

   memberSelectEl.addEventListener("change", async () => {
  const memberId = memberSelectEl.value;

  if (!memberId) return;

  const member = members[memberId];

  // CHECKS CATEGORY AGAIN BEFORE SAVE
  if (!member || !member.categories.includes(task.category)) {
    alert("This member does not match the category of the task.");
    return;
  }

  const changes: Record<string, unknown> = {
    // ASSIGNS TASK AND MOVES IT TO IN-PROGRESS
    [`tasks/${task.id}/assignedTo`]: memberId,
    [`tasks/${task.id}/status`]: "in-progress",

    // ADDS TASK TO MEMBER'S ONGOING TASKS
    [`members/${memberId}/ongoingTasks`]: [
        ...new Set([
            ...(member.ongoingTasks ?? []),
            task.id
        ])
    ],

    // ADDS MEMBER TO PROJECT
    [`projects/${project.id}/members`]: [
        ...new Set([
            ...(project.members ?? []),
            memberId
        ])
    ],

    // ADDS PROJECT TO MEMBER'S PROJECT LIST
    [`members/${memberId}/projects`]: [
        ...new Set([
            ...(member.projects ?? []),
            project.id
        ])
    ]
};

  // IF THE TASK WAS PREVIOUSLY ASSIGNED TO SOMEONE ELSE,
  // REMOVES TASK ID FROM THAT MEMBER'S LIST
  if (task.assignedTo && task.assignedTo !== memberId) {
    const previousMember = members[task.assignedTo];

    if (previousMember) {
      changes[`members/${previousMember.id}/ongoingTasks`] =
        (previousMember.ongoingTasks ?? []).filter(
          id => id !== task.id
        );
    }
  }

  try {
    await update(ref(db), changes);
  } catch (error) {
    console.error("Could not assign task:", error);
    alert("Kunde inte tilldela uppgiften.");
  }
});

    memberWrapperEl.append(
        memberLabelEl,
        memberSelectEl
    );

    return memberWrapperEl;

}


export const createAssignedMemberInfo = (
  task: Task,
  members: Record<string, Member>
) => {
  const paragraph = document.createElement("p");
  paragraph.className = "mt-4 text-sm text-slate-300";

  const member = task.assignedTo
    ? members[task.assignedTo]
    : undefined;

  paragraph.textContent = `Assigned to: ${member?.name ?? "Unknown member"}`;

  return paragraph;
};