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
    // Visa endast medlemmar med rätt kategori.
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

  // Kontrollera kategorin igen innan vi sparar.
  if (!member || !member.categories.includes(task.category)) {
    alert("Medlemmen har inte rätt kategori för uppgiften.");
    return;
  }

  const changes: Record<string, unknown> = {
    // Tilldela uppgiften och flytta den till In-progress
    [`tasks/${task.id}/assignedTo`]: memberId,
    [`tasks/${task.id}/status`]: "in-progress",

    // Lägg till uppgiften i medlemmens pågående uppgifter
    [`members/${memberId}/ongoingTasks`]: [
        ...new Set([
            ...(member.ongoingTasks ?? []),
            task.id
        ])
    ],

    // Lägg till medlemmen i projektet
    [`projects/${project.id}/members`]: [
        ...new Set([
            ...(project.members ?? []),
            memberId
        ])
    ],

    // Lägg till projektet i medlemmens projektlista
    [`members/${memberId}/projects`]: [
        ...new Set([
            ...(member.projects ?? []),
            project.id
        ])
    ]
};

  // Om uppgiften tidigare var tilldelad någon annan,
  // ta bort uppgifts-ID:t från den personens lista.
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