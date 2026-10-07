
const membersContainer = document.getElementById("membersContainer") as HTMLElement;
const membersListContainer = document.getElementById("memberList") as HTMLUListElement;

export const renderMembers = (members) => {
    membersListContainer.innerHTML = "";

    Object.values(members).forEach((member) => {
        const memberListItem = document.createElement("li") as HTMLLIElement;
        memberListItem.className =
    "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition hover:border-indigo-500";

        const memberName = document.createElement("h4") as HTMLHeadingElement;
        memberName.textContent = member.name;
        memberName.className =
    "mb-3 text-lg font-bold text-slate-100";

        const memberCategory = document.createElement("p") as HTMLParagraphElement;
        memberCategory.textContent = `Categories: ${member.categories.join(", ")}`;
        memberCategory.className =
    "mb-2 text-sm text-slate-400";

        const memberProject = document.createElement("p") as HTMLParagraphElement;
        memberProject.textContent =  `Projects: ${member.projects?.join(", ") ?? "No available projects"}`;
        memberProject.className =
    "mb-2 text-sm text-slate-400";

        const memberTasksTitle  = document.createElement("p") as HTMLParagraphElement;
       memberTasksTitle.textContent = `Ongoing tasks: ${member.ongoingTasks.length ?? "No available tasks"}`;
memberTasksTitle.className =
    "mt-3 border-t border-slate-700 pt-3 text-sm font-medium text-cyan-400";

    
        memberListItem.append(
            memberName,
            memberCategory,
            memberProject,
            memberTasksTitle,
   
        );

        
        membersListContainer.append(memberListItem);

    });
    membersContainer.appendChild(membersListContainer)
};



