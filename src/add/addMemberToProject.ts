import { ref, update } from "firebase/database";
import { db } from "../firebaseconfig.ts";
import type { Project } from "../classes/Project.ts";
import type { Member } from "../classes/Member.ts";

export async function addMemberToProject(
    project: Project,
    member: Member
) {
    const projectMembers = new Set(project.members ?? []);
    projectMembers.add(member.id);

    const memberProjects = new Set(member.projects ?? []);
    memberProjects.add(project.id);

    await update(ref(db), {
        [`projects/${project.id}/members`]:
            [...projectMembers],

        [`members/${member.id}/projects`]:
            [...memberProjects]
    });
}