
const projectDetails =
    document.getElementById("projectDetails") as HTMLDivElement;

const projectMembers =
    document.getElementById("projectMembers") as HTMLDivElement;

const projectTasks =
    document.getElementById("projectTasks") as HTMLDivElement;


export const renderDetailedProject = (
    project,
    members,
    tasks
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


    projectDetails.append(
        projectTitleEl,
        projectDescriptionEl
    );


    // MEMBERS
  
    projectMembers.innerHTML = "";

    project.members.forEach((memberId) => {

        const member =
            members[memberId];

        if (!member) {
            return;
        }


        const memberCard =
            document.createElement("article");

        memberCard.className =
            "rounded-xl border border-slate-700 bg-slate-800 p-5";


        const memberNameEl =
            document.createElement("h4");

        memberNameEl.textContent =
            member.name;

        memberNameEl.className =
            "text-lg font-bold text-slate-100";


        const memberCategoryEl =
            document.createElement("p");

        memberCategoryEl.textContent =
            `Categories: ${member.categories.join(", ")}`;

        memberCategoryEl.className =
            "mt-2 text-sm text-slate-400";


        const activeTasks =
            Object.values(tasks).filter(
                (task) =>
                    task.assignedTo === member.memberId &&
                    task.status !== "completed"
            ).length;


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

        projectMembers.append(
            memberCard
        );

    });


 
    // TASKS
    
    projectTasks.innerHTML = "";

    project.tasks.forEach((taskId) => {

        const task =
            tasks[taskId];

        if (!task) {
            return;
        }


        const taskCard =
            document.createElement("article");

        taskCard.className =
            "mb-3 rounded-xl border border-slate-700 bg-slate-800 p-5";


        const title =
            document.createElement("h4");

        title.textContent =
            task.title;

        title.className =
            "text-lg font-bold text-slate-100";


        const status =
            document.createElement("p");

        status.textContent =
            `Status: ${task.status}`;

        status.className =
            "mt-2 text-sm text-slate-400";


        taskCard.append(
            title,
            status
        );

        projectTasks.append(
            taskCard
        );

    });
};

