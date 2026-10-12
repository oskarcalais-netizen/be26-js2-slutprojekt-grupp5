export interface ProjectFilterOptions {
  title?: string;
  sortBy?: 'title' | 'deadline' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectItem {
  id: string;
  title: string;
  deadline: string | Date;
  createdAt: string | Date;
  [key: string]: any;
}

export function filterAndSortProjects(
  projects: ProjectItem[],
  options: ProjectFilterOptions
): ProjectItem[] {
  const { title, sortBy = 'createdAt', sortOrder = 'asc' } = options;

  const filteredProjects = projects.filter((project) => {
    if (title && !project.title.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }
    return true;
  });

  return filteredProjects.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
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