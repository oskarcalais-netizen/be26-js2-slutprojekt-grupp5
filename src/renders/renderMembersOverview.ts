import type { Member } from "../classes/Member";
import type { Project } from "../classes/Project";

const membersContainer = document.getElementById(
  "membersContainer",
) as HTMLElement;
const membersListContainer = document.getElementById(
  "memberList",
) as HTMLUListElement;

export const renderMembers = (
  members: Record<string, Member>,
  projects: Record<string, Project> = {}
) => {
  membersListContainer.innerHTML = "";

  Object.values(members).forEach((member) => {
    const memberListItem = document.createElement("li");
    memberListItem.className =
      "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition hover:border-indigo-500";

    const memberName = document.createElement("h4");
    memberName.textContent = member.name;
    memberName.className = "mb-3 text-lg font-bold text-slate-100";

    const memberCategory = document.createElement("p");
    memberCategory.textContent = `Categories: ${member.categories.join(", ")}`;
    memberCategory.className = "mb-2 text-sm text-slate-400";

    const projectNames = (member.projects ?? [])
      .map((projectId) => projects[projectId]?.title)
      .filter((title): title is string => Boolean(title));

    const memberProject = document.createElement("p");
    memberProject.textContent = `Projects: ${
      projectNames.length > 0 ? projectNames.join(", ") : "No available projects"
    }`;
    memberProject.className = "mb-2 text-sm text-slate-400";

    const memberTasks = document.createElement("p") as HTMLParagraphElement;
    memberTasks.textContent = `Ongoing tasks: ${member.ongoingTasks.length}`;
    memberTasks.className =
      "mt-3 border-t border-slate-700 pt-3 text-sm font-medium text-cyan-400";

    const message = document.createElement("p");
    message.hidden = true;
    message.style.color = "#fcd34d";

    // CREATES DELETE BUTTON
    const deleteMemberBtn = document.createElement("button");

    deleteMemberBtn.type = "button";
    deleteMemberBtn.textContent = "Delete member";
    deleteMemberBtn.className = "deleteMemberBtn";

    // CREATES A CONFIRMATION BEFORE DELETION OF MEMBER IN EACH MEMBER BOX
    const cancelDeleteBtn = document.createElement("button");

    cancelDeleteBtn.type = "button";
    cancelDeleteBtn.textContent = "No";
    cancelDeleteBtn.className = "deleteMemberBtn";
    cancelDeleteBtn.hidden = true;

    let confirmationQuestion = false;

    deleteMemberBtn.addEventListener("click", async () => {
      if (deleteMemberBtn.disabled === true) {
        return;
      }

      // MEMBER CANNOT BE DELETED IF CONNECTED TO A PROJECT
      if (member.projects.length > 0) {
        message.textContent =
          "This member belongs to a project and cannot be deleted.";

        message.hidden = false;

        return;
      }

      if (confirmationQuestion === false) {
        message.textContent = "Are you sure you want to delete this member?";
        message.hidden = false;

        deleteMemberBtn.textContent = "Yes, delete";
        cancelDeleteBtn.hidden = false;

        confirmationQuestion = true;
        return;
      }

      deleteMemberBtn.disabled = true;
      cancelDeleteBtn.disabled = true;

      try {
        await member.delete();
      } catch {
        message.textContent = "The member could not be deleted. Try again.";

        deleteMemberBtn.disabled = false;
        cancelDeleteBtn.disabled = false;
      }
    });

    cancelDeleteBtn.addEventListener("click", () => {
      if (deleteMemberBtn.disabled === true) {
        return;
      }

      confirmationQuestion = false;

      message.textContent = "";
      message.hidden = true;

      cancelDeleteBtn.hidden = true;
      deleteMemberBtn.textContent = "Delete member";
    });

    memberListItem.append(
      memberName,
      memberCategory,
      memberProject,
      memberTasks,
      message,
      deleteMemberBtn,
      cancelDeleteBtn,
    );

    membersListContainer.append(memberListItem);
  });
  membersContainer.appendChild(membersListContainer);
};
