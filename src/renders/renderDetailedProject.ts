import type { Member } from "../classes/Member";
import type { Project } from "../classes/Project";
import type { Task } from "../classes/Task";
import { ref, update } from "firebase/database";
import { db } from "../firebaseconfig";


const projectDetails = document.getElementById("projectDetails") as HTMLDivElement;
const projectMembers = document.getElementById("projectMembers") as HTMLDivElement;


export const renderDetailedProject = (
    project: Project,
    members: Record<string, Member>,
    tasks: Record<string, Task>
) => {


    // PROJECT DETAILS
    
    projectDetails.innerHTML = "";
    projectDetails.className= "display flex flex-col gap-4 justify-center items-center"

    const projectTitleEl =
        document.createElement("h2");

    projectTitleEl.textContent =
        project.title;

    projectTitleEl.className =
        "text-3xl font-bold text-slate-100";


    const projectDescriptionEl =
        document.createElement("p");

    projectDescriptionEl.textContent =
        project.description;

    projectDescriptionEl.className =
        "mt-3 text-slate-400";

    const projectDeadlineEl = document.createElement("p");

    projectDeadlineEl.textContent =
        `Deadline: ${project.deadline}`;

    projectDeadlineEl.className =
        "text-sm text-slate-400";


    projectDetails.append(
        projectTitleEl,
        projectDescriptionEl,
        projectDeadlineEl
    );

    // DELETE PROJECT BUTTON & CONFIRMATION
    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.type = "button";
    deleteProjectBtn.textContent = "Delete project";
    deleteProjectBtn.className = "deleteMemberBtn";

    const cancelDeleteProjectBtn = document.createElement("button");
    cancelDeleteProjectBtn.type = "button";
    cancelDeleteProjectBtn.textContent = "No";
    cancelDeleteProjectBtn.className = "deleteMemberBtn";
    cancelDeleteProjectBtn.hidden = true;

    const projectMessage = document.createElement("p");
    projectMessage.className = "mt-2 text-sm text-amber-300";
    projectMessage.hidden = true;

    let confirmProjectDelete = false;

    deleteProjectBtn.addEventListener("click", async () => {
        if (deleteProjectBtn.disabled) return;

        if (confirmProjectDelete === false) {
            projectMessage.textContent = "Are you sure you want to delete this project?";
            projectMessage.hidden = false;

            deleteProjectBtn.textContent = "Yes, delete";
            cancelDeleteProjectBtn.hidden = false;

            confirmProjectDelete = true;
            return;
        }

        deleteProjectBtn.disabled = true;
        cancelDeleteProjectBtn.disabled = true;

        const updates: Record<string, unknown> = {};

        // REMOVE PROJECT REFERENCE FROM MEMBERS
        (project.members ?? []).forEach((memberId) => {
            const m = members[memberId];
            if (m) {
                updates[`members/${memberId}/projects`] = (m.projects ?? []).filter(
                    (id) => id !== project.id
                );
            }
        });

        // REMOVE PROJECT TASKS FROM FIREBASE
        (project.tasks ?? []).forEach((taskId) => {
            updates[`tasks/${taskId}`] = null;
        });

        // REMOVE THE PROJECT ITSELF
        updates[`projects/${project.id}`] = null;

        try {
            await update(ref(db), updates);
            document.getElementById("backToOverviewBtn")?.click();
        } catch (error) {
            console.error("Could not delete project:", error);
            projectMessage.textContent = "The project could not be deleted. Try again.";
            deleteProjectBtn.disabled = false;
            cancelDeleteProjectBtn.disabled = false;
        }
    });

    cancelDeleteProjectBtn.addEventListener("click", () => {
        if (deleteProjectBtn.disabled) return;

        confirmProjectDelete = false;
        projectMessage.textContent = "";
        projectMessage.hidden = true;
        cancelDeleteProjectBtn.hidden = true;
        deleteProjectBtn.textContent = "Delete project";
    });

    const projectBtnWrapper = document.createElement("div");
    projectBtnWrapper.className = "mt-2 flex items-center gap-2";
    projectBtnWrapper.append(deleteProjectBtn, cancelDeleteProjectBtn);

    projectDetails.append(projectBtnWrapper, projectMessage);

    // MEMBERS
  
    projectMembers.innerHTML = "";

    project.members.forEach((memberId) => {

        const member = members[memberId];

        if (!member) {
            return;
        }


        const memberCard =
            document.createElement("article");

        memberCard.className =
            "rounded-xl border border-slate-700 bg-slate-800 p-5";


        const memberNameEl =
            document.createElement("h4");

        memberNameEl.textContent = member.name;

        memberNameEl.className =
            "text-lg font-bold text-slate-100";


        const memberCategoryEl =
            document.createElement("p");

        memberCategoryEl.textContent =
            `Categories: ${member.categories.join(", ")}`;

        memberCategoryEl.className =
            "mt-2 text-sm text-slate-400";


        const activeTasks = project.tasks.filter((taskId) => {
    const task = tasks[taskId];

    return (
        task &&
        task.assignedTo === member.id &&
        (task.status === "in-progress" ||
         task.status === "in-review")
    );
}).length;


        const taskCount =
            document.createElement("p");

        taskCount.textContent =
            `Ongoing tasks: ${activeTasks}`;

        taskCount.className =
            "mt-2 text-sm text-indigo-400";

        // REMOVE MEMBER FROM PROJECT BUTTON & CONFIRMATION
        const removeMemberBtn = document.createElement("button");
        removeMemberBtn.type = "button";
        removeMemberBtn.textContent = "Remove from project";
        removeMemberBtn.className = "deleteMemberBtn";

        const cancelRemoveMemberBtn = document.createElement("button");
        cancelRemoveMemberBtn.type = "button";
        cancelRemoveMemberBtn.textContent = "No";
        cancelRemoveMemberBtn.className = "deleteMemberBtn";
        cancelRemoveMemberBtn.hidden = true;

        const memberMessage = document.createElement("p");
        memberMessage.className = "mt-2 text-sm text-amber-300";
        memberMessage.hidden = true;

        let confirmMemberRemove = false;

        removeMemberBtn.addEventListener("click", async () => {
            if (removeMemberBtn.disabled) return;

            // STOP REMOVAL IF MEMBER HAS ACTIVE TASKS IN PROJECT
            if (activeTasks > 0) {
                memberMessage.textContent = "This member has ongoing tasks in this project and cannot be removed.";
                memberMessage.hidden = false;
                return;
            }

            if (confirmMemberRemove === false) {
                memberMessage.textContent = "Are you sure you want to remove this member from the project?";
                memberMessage.hidden = false;

                removeMemberBtn.textContent = "Yes, remove";
                cancelRemoveMemberBtn.hidden = false;

                confirmMemberRemove = true;
                return;
            }

            removeMemberBtn.disabled = true;
            cancelRemoveMemberBtn.disabled = true;

            const updates: Record<string, unknown> = {
                [`projects/${project.id}/members`]: (project.members ?? []).filter(
                    (id) => id !== member.id
                ),
                [`members/${member.id}/projects`]: (member.projects ?? []).filter(
                    (id) => id !== project.id
                ),
            };

            try {
                await update(ref(db), updates);
            } catch (error) {
                console.error("Could not remove member from project:", error);
                memberMessage.textContent = "The member could not be removed. Try again.";
                removeMemberBtn.disabled = false;
                cancelRemoveMemberBtn.disabled = false;
            }
        });

        cancelRemoveMemberBtn.addEventListener("click", () => {
            if (removeMemberBtn.disabled) return;

            confirmMemberRemove = false;
            memberMessage.textContent = "";
            memberMessage.hidden = true;
            cancelRemoveMemberBtn.hidden = true;
            removeMemberBtn.textContent = "Remove from project";
        });

        const memberBtnWrapper = document.createElement("div");
        memberBtnWrapper.className = "mt-3 flex items-center";
        memberBtnWrapper.append(removeMemberBtn, cancelRemoveMemberBtn);

        memberCard.append(
            memberNameEl,
            memberCategoryEl,
            taskCount,
            memberBtnWrapper,
            memberMessage
        );

        projectMembers.appendChild(
            memberCard
        );

    });

 
}

