import type { Task } from "../classes/Task";
import { formatDate } from "../utils/formatDate";

export const createBaseTaskCard = (task: Task) => {
    
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