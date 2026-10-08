import type { Category, Priority, TaskStatus } from "../types/types";


export class Task {
    id: string; 
    title: string; 
    description: string; 
    category: Category; 
    priority: Priority; 
    created: string; 
    deadline: string; 
    assignedTo?: string; 
    status: TaskStatus; 
    completedAt?: string; 
    projectId: string;

    constructor (
        id: string,
        title: string,
        description: string,
        category: Category, 
        priority: Priority, 
        deadline: string, 
        projectId: string)
        {
          this.id = id; 
          this.title = title; 
          this.description = description; 
          this.category = category; 
          this.priority = priority; 
          this.deadline = deadline; 
          this.projectId = projectId;
          this.created = new Date().toISOString();
          this.status = "new";
  }

    assignMember(memberId: string) { 
        this.assignedTo = memberId; 
        this.status = "in-progress"; 
    }

    complete() { 
        this.status = "completed"; 
        this.completedAt = new Date().toISOString(); 
    }

    getData() { 
        return { 
            id: this.id, 
            title: this.title, 
            description: this.description, 
            category: this.category, 
            priority: this.priority, 
            created: this.created, 
            deadline: this.deadline, 
            assignedTo: this.assignedTo, 
            status: this.status, 
            completedAt: this.completedAt, 
            projectId: this.projectId, };
        }
    }


