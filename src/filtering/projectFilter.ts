export interface ProjectFilterOptions {
  title?: string;
  sortBy?: 'title' | 'deadline' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectItem {
  id: string;
  title: string;
  deadline: string | Date;
  createdAt: string | Date; // <-- Placeholder
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
        comparison = a.title.localeCompare(b.title);
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