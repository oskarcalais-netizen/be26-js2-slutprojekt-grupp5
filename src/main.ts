//För testning av Firebase Realtime Database
//Dessa "funktioner" används för att hämta data från Firebase och eventuella uppdateringar hämtas i realtid.

import { onValue, ref } from "firebase/database";

import { db } from "./firebaseconfig.ts";

const projectsRef = ref(db, "projects");
const membersRef = ref(db, "members");
const tasksRef = ref(db, "tasks");



onValue(projectsRef, snapshot => {
    const projects = snapshot.val();
    
    console.log(projects);
})

onValue(membersRef, snapshot => {
    const members = snapshot.val();
    console.log(members);
});

onValue(tasksRef, snapshot => {
    const tasks = snapshot.val();
    console.log(tasks);
})
