import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

import { ref, update } from "firebase/database";
import { db } from "../firebaseconfig";

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
    tasks: string[] = [],
  ) {
    this.id = id;
    this.title = capitalizeFirstLetter(title);
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

  // Sparar projektet och medlemmarnas projektlistor tillsammans i Firebase.
  async save(changes: object) {
    const projectData = this.getData();
    const projectPath = "projects/" + this.id;

    // Lägg projektets information bland ändringarna som ska sparas.
    Object.assign(changes, {
      [projectPath]: projectData,
    });

    // Spara alla samlade ändringar i Firebase.
    const databaseRef = ref(db);

    await update(databaseRef, changes);
  }
}
