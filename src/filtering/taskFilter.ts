export type PriorityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface TaskFilterOptions {
  title?: string;
  priority?: PriorityLevel;
  assignedMemberId?: string;
  category?: string;
  sortBy?: 'title' | 'priority' | 'assignedMember' | 'category' | 'deadline' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskItem {
  id: string;
  title: string;
  priority: PriorityLevel;
  assignedMemberId: string;
  assignedMemberName?: string;
  category: string;
  deadline: string | Date;
  createdAt: string | Date; // <-- Placeholder
  [key: string]: any;
}

const PRIORITY_WEIGHTS: Record<PriorityLevel, number> = {
  Low: 1,
  Moderate: 2,
  High: 3,
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
    if (priority && task.priority !== priority) {
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

  return filteredTasks.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        comparison = PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
        break;
      case 'assignedMember':
        const memberA = a.assignedMemberName || '';
        const memberB = b.assignedMemberName || '';
        comparison = memberA.localeCompare(memberB);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'deadline':
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}