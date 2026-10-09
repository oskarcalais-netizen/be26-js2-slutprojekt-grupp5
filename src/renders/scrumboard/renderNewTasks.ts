import {ref,update} from "firebase/database";

import { db } from "../../firebaseconfig.ts";

import {format} from "date-fns"
import { sv } from "date-fns/locale";

import type { Task } from "../../classes/Task.ts";
import type { Project } from "../../classes/Project.ts";
import type { Member } from "../../classes/Member.ts";

const formatDate = (date?: string) => {
    if (!date) {
        return "-";
    }

    return format(new Date(date),  "d MMMM yyyy",
            { locale: sv }
    );
};

const createBaseTaskCard = (task: Task) => {
    
    const taskCard = document.createElement("article");
     taskCard.className =
        "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg";

    const taskTitle = document.createElement("h5");

    taskTitle.textContent = task.title;

    taskTitle.className ="text-lg font-bold text-slate-100";

    const taskDescription = document.createElement("p")
    taskDescription.textContent = task.description;

    taskDescription.className ="mt-2 text-sm leading-5 text-slate-400";

    const taskCategory =document.createElement("p");

    taskCategory.textContent =`Category: ${task.category}`;

    taskCategory.className ="mt-3 text-sm text-indigo-400";

    const createdTaskDate = document.createElement("p");

    createdTaskDate.textContent = `Created: ${formatDate(task.created)}`;

    createdTaskDate.className ="mt-2 text-sm text-slate-500";

     taskCard.append(
        taskTitle,
        taskDescription,
        taskCategory,
        createdTaskDate
    );


    return taskCard;

}

const createDeadlineInput = (task:Task) => {
     const deadlineWrapper = document.createElement("div");

    deadlineWrapper.className = "mt-4";

    const deadlineLabel = document.createElement("label");

    deadlineLabel.textContent ="Deadline";

    deadlineLabel.className ="block text-sm font-medium text-slate-300";

    const deadlineInput = document.createElement("input");

    deadlineInput.type = "date";

    deadlineInput.value = task.deadline ?? "";

    deadlineInput.className ="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";

    deadlineInput.addEventListener("change", async ()=>{
        await update(
                ref(db, `tasks/${task.id}`),
                {
                    deadline: deadlineInput.value
                }
            );

    })
       deadlineWrapper.append(
        deadlineLabel,
        deadlineInput
    );


    return deadlineWrapper;
}

const createPrioritySelect = (task: Task) => {

    const priorityWrapper = document.createElement("div");

    priorityWrapper.className = "mt-4";


    const priorityLabel = document.createElement("label");

    priorityLabel.textContent = "Priority";

    priorityLabel.className = "block text-sm font-medium text-slate-300";


    const prioritySelect = document.createElement("select");

    prioritySelect.className = "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100";


    const priorities = [
        "low",
        "moderate",
        "high",
        "critical"
    ];


    priorities.forEach(
        (priority) => {

            const option = document.createElement("option");

            option.value = priority;

            option.textContent = priority;

            option.selected = priority === task.priority;

            prioritySelect.appendChild(
                option
            );

        }
    );


    prioritySelect.addEventListener(
        "change",
        async () => {

            await update(
                ref(db, `tasks/${task.id}`),
                {
                    priority:
                        prioritySelect.value
                }
            );

        }
    );


    priorityWrapper.append(
        priorityLabel,
        prioritySelect
    );


    return priorityWrapper;
};

const createMemberSelect = (task: Task, project: Project, members: Record<string, Member>)=> {
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

    project.members.forEach((memberId) => {
        const member = members[memberId];

        if (!member) {
            return;
        }

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

    memberSelectEl.addEventListener(
        "change",
        async () => {
            const memberId = memberSelectEl.value;

            if (!memberId) {
                return;
            }

            await update(
                ref(db, `tasks/${task.id}`),
                {
                    assignedTo: memberId,
                    status: "in-progress"
                }
            );
        }
    );

    memberWrapperEl.append(
        memberLabelEl,
        memberSelectEl
    );

    return memberWrapperEl;

}

export const renderNewTask = (
    task: Task,
    project: Project,
    members: Record<string, Member>
) => {
    const taskCard = createBaseTaskCard(task);

    const deadline = createDeadlineInput(task);

    const priority = createPrioritySelect(task);

    const memberSelect = createMemberSelect(
        task,
        project,
        members
    );

    taskCard.append(
        deadline,
        priority,
        memberSelect
    );

    return taskCard;
};