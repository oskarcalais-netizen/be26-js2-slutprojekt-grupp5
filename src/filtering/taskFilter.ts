import type { TaskItem , TaskFilterOptions } from "../types/types";

const PRIORITY_WEIGHTS: Record<string, number> = {
  low: 1,
  Low: 1,
  moderate: 2,
  Moderate: 2,
  high: 3,
  High: 3,
  critical: 4,
  Critical: 4
};

export function filterAndSortTasks(
  tasks: TaskItem[],
  options: TaskFilterOptions
): TaskItem[] {
  const {
    title,
    priority,
    assignedMemberId,
    category,
    sortBy = 'createdAt',
    sortOrder = 'asc'
  } = options;

  const filteredTasks = tasks.filter((task) => {
    if (title && !task.title.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }
    if (priority && task.priority.toLowerCase() !== priority.toLowerCase()) {
      return false;
    }
    if (assignedMemberId && task.assignedMemberId !== assignedMemberId) {
      return false;
    }
    if (category && task.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    return true;
  });

  return [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;

      case 'priority': {
        const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
        comparison = weightA - weightB;
        break;
      }

      case 'assignedMember': {
        const memberA = a.assignedMemberName || '';
        const memberB = b.assignedMemberName || '';
        comparison = memberA.localeCompare(memberB);
        break;
      }

      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '');
        break;

      case 'deadline': {
        const timeA = a.deadline ? new Date(a.deadline).getTime() : 0;
        const timeB = b.deadline ? new Date(b.deadline).getTime() : 0;
        comparison = (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
        break;
      }

      case 'createdAt': {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
        break;
      }
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}