import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { ref, update } from "firebase/database";
import { db } from "../firebaseconfig";

export class Project {
  public readonly id: string;
  public title: string;
  public description: string;
  public deadline: string;
  public members: string[];
  public tasks: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    deadline: string,
    members: string[] = [],
    tasks: string[] = []
  ) {
    this.id = id;
    this.title = capitalizeFirstLetter(title);
    this.description = capitalizeFirstLetter(description);
    this.deadline = deadline;
    this.members = members;
    this.tasks = tasks;
  }

  public addTask(taskId: string): void {
    if (!this.tasks.includes(taskId)) {
      this.tasks.push(taskId);
    }
  }

  public removeTask(taskId: string): void {
    this.tasks = this.tasks.filter((id) => id !== taskId);
  }

  getData() {
    return {
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      members: this.members,
      tasks: this.tasks,
  }};

    // SAVES PROJECT WITH MEMBER PROJECT LISTS IN FIREBASE
  async save(changes: object) {
    const projectData = this.getData();
    const projectPath = "projects/" + this.id;

    // ADDS PROJECT INFO TO CHANGES TO BE SAVED
    Object.assign(changes, {
      [projectPath]: projectData,
    });

    // SAVE ALL COMPILED CHANGES TO FIREBASE
    const databaseRef = ref(db);

    await update(databaseRef, changes);
  }
}