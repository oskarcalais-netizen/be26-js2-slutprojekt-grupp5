
import type { Task } from "../classes/Task.ts";
import type { Project } from "../classes/Project.ts";
import type { Member } from "../classes/Member.ts";

import {createBaseTaskCard} from "../components/baseTaskCard.ts";
import { createEditableFields } from "../utils/createEditableFields.ts";
import {createAssignedMemberInfo, createMemberSelection} from "../utils/createMemberInfo.ts";
import { ref, update } from "firebase/database";
import { db } from "../firebaseconfig.ts";
import { createActionButton } from "../utils/createActionButton.ts";
import { formatDate } from "../utils/formatDate.ts";


// NEW
export const renderNewTaskColumn = (
    task: Task,
    project: Project,
    members: Record<string, Member>
) => {
    const taskCard = createBaseTaskCard(task);

    const editableFields = createEditableFields(task);

    const memberSelect = createMemberSelection(
        task,
        project,
        members
    );

    taskCard.append(
        editableFields,
        memberSelect
    );

    return taskCard;
};

// IN-PROGRESS
export const renderInProgressTaskColumn = (
  task: Task,
  members: Record<string, Member>
) => {
  const card = createBaseTaskCard(task);

  card.append(
    createEditableFields(task),
    createAssignedMemberInfo(task, members)
  );

  const reviewButton = createActionButton(
    "Send to review",
    async () => {
      await update(ref(db, `tasks/${task.id}`), {
        status: "in-review",
      });
    }
  );

  card.appendChild(reviewButton);

  return card;
};

// IN-REVIEW
export const renderInReviewTaskColumn = (
  task: Task,
  members: Record<string, Member>
) => {
  const card = createBaseTaskCard(task);

  card.append(
    createEditableFields(task),
    createAssignedMemberInfo(task, members)
  );

  const completeButton = createActionButton(
    "Mark completed",
    async () => {
      const changes: Record<string, unknown> = {
        [`tasks/${task.id}/status`]: "completed",
        [`tasks/${task.id}/completedAt`]: new Date().toISOString(),
      };

      if (task.assignedTo) {
        const member = members[task.assignedTo];

        if (member) {
          changes[`members/${member.id}/ongoingTasks`] =
            (member.ongoingTasks ?? []).filter(
              taskId => taskId !== task.id
            );
        }
      }

      await update(ref(db), changes);
    }
  );

  card.appendChild(completeButton);

  return card;
};

// COMPLETED
export const renderCompletedTaskColumn = (
  task: Task,
  project: Project,
  members: Record<string, Member>
) => {
  const card = createBaseTaskCard(task);

  const deadline = document.createElement("p");
  deadline.className = "mt-3 text-sm text-slate-300";
  deadline.textContent = `Deadline: ${formatDate(task.deadline)}`;

  const completedAt = document.createElement("p");
  completedAt.className = "mt-2 text-sm text-emerald-400";
  completedAt.textContent = `Completed: ${formatDate(task.completedAt)}`;

  card.append(
    deadline,
    completedAt,
    createAssignedMemberInfo(task, members)
  );

  const deleteButton = createActionButton(
    "Delete task",
    async () => {
      if (!window.confirm(`Delete "${task.title}"?`)) {
        return;
      }

      const changes: Record<string, unknown> = {
        [`tasks/${task.id}`]: null,
        [`projects/${project.id}/tasks`]: project.tasks.filter(
          taskId => taskId !== task.id
        ),
      };

      if (task.assignedTo) {
        const member = members[task.assignedTo];

        if (member) {
          changes[`members/${member.id}/ongoingTasks`] =
            (member.ongoingTasks ?? []).filter(
              taskId => taskId !== task.id
            );
        }
      }

      await update(ref(db), changes);
    },
    "bg-red-700 hover:bg-red-600"
  );

  card.appendChild(deleteButton);

  return card;
};