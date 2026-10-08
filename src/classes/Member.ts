export class Member {
  id: string;
  name: string;
  categories: string[];
  ongoingTasks: string[];
  projects: string[];

  constructor(
    id: string,
    name: string,
    categories: string[],
    ongoingTasks: string[] = [],
    projects: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.categories = categories;
    this.ongoingTasks = ongoingTasks;
    this.projects = projects;
  }

  getData() {
    return {
      name: this.name,
      categories: this.categories,
      ongoingTasks: this.ongoingTasks,
      projects: this.projects,
    };
  }
}
