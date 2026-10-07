export class Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  memberIds: string[];
  taskIds: string[];

  constructor(
    id: string,
    name: string,
    description: string,
    deadline: string,
    memberIds: string[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.memberIds = memberIds;
    this.taskIds = [];
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      deadline: this.deadline,
      memberIds: this.memberIds,
      taskIds: this.taskIds,
    };
  }
}
