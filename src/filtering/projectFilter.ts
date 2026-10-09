export interface ProjectFilterOptions {
  name?: string;
  sortBy?: 'name' | 'deadline' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectItem {
  id: string;
  name: string;
  deadline: string | Date;
  createdAt: string | Date; // <-- Placeholder
  [key: string]: any;
}

export function filterAndSortProjects(
  projects: ProjectItem[],
  options: ProjectFilterOptions
): ProjectItem[] {
  const { name, sortBy = 'createdAt', sortOrder = 'asc' } = options;

  const filteredProjects = projects.filter((project) => {
    if (name && !project.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return true;
  });

  return filteredProjects.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
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