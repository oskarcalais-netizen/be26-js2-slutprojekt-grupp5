import type { Member } from "../classes/Member";

const membersContainer = document.getElementById(
  "membersContainer",
) as HTMLElement;
const membersListContainer = document.getElementById(
  "memberList",
) as HTMLUListElement;

export const renderMembers = (members: Record<string, Member>) => {
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

    const memberProject = document.createElement("p");
    memberProject.textContent = `Projects: ${member.projects.length > 0 ? member.projects.join(", ") : "No available projects"}`;
    memberProject.className = "mb-2 text-sm text-slate-400";

    const memberTasks = document.createElement("p") as HTMLParagraphElement;
    memberTasks.textContent = `Ongoing tasks: ${member.ongoingTasks.length}`;
    memberTasks.className =
      "mt-3 border-t border-slate-700 pt-3 text-sm font-medium text-cyan-400";

    const message = document.querySelector(
      "#memberMessage",
    ) as HTMLParagraphElement;

    // Skapar delete knappen under varje member låda
    const deleteMemberBtn = document.createElement("button");

    deleteMemberBtn.type = "button";
    deleteMemberBtn.textContent = "Delete member";
    deleteMemberBtn.className = "deleteMemberBtn";

    deleteMemberBtn.addEventListener("click", async () => {
      try {
        await member.delete();
      } catch {
        message.textContent = "The member could not be saved. Try again.";
      }
    });

    memberListItem.append(
      memberName,
      memberCategory,
      memberProject,
      memberTasks,
      deleteMemberBtn,
    );

    membersListContainer.append(memberListItem);
  });
  membersContainer.appendChild(membersListContainer);
};
