import { formatProjectTitle } from '../utils/capitalizeFirstLetter';

export class Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  members: string[];
  tasks: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    deadline: string,
    members: string[],
     tasks: string[] = []
  ) {
    this.id = id;
    this.title = formatProjectTitle(title);
    this.description = description;
    this.deadline = deadline;
    this.members = members;
    this.tasks = tasks;
  }

  getData() {
    return {
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      members: this.members,
      tasks: this.tasks,
    };
  }
}
