import type { Member } from "../classes/Member";
import type { Project } from "../classes/Project";
import type { Task } from "../classes/Task";


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


        memberCard.append(
            memberNameEl,
            memberCategoryEl,
            taskCount
        );

        projectMembers.appendChild(
            memberCard
        );

    });

 
}

