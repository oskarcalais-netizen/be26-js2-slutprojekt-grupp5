import { ref, set, remove } from "firebase/database";
import { db } from "../firebaseconfig";
import { formatMemberName } from '../utils/capitalizeFirstLetter';

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
    projects: string[] = [],
  ) {
    this.id = id;
    this.name = formatMemberName(name);
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

  async save() {
    const memberRef = ref(db, "members/" + this.id);
    const memberData = this.getData();

    await set(memberRef, memberData);
  }

  async delete() {
    const memberRef = ref(db, "members/" + this.id);

    await remove(memberRef);
  }
}
