export class Member {
  id: string;
  name: string;
  categories: string[];
  ongoingTaskCount: number;
  projectIds: string[];

  constructor(id: string, name: string, categories: string[]) {
    this.id = id;
    this.name = name;
    this.categories = categories;
    this.ongoingTaskCount = 0;
    this.projectIds = [];
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      categories: this.categories,
      ongoingTaskCount: this.ongoingTaskCount,
      projectIds: this.projectIds,
    };
  }
}
