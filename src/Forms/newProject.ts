import { get, ref, push } from "firebase/database";
import { db } from "../firebaseconfig";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { Project } from "../classes/Project";
import { Member } from "../classes/Member";

let projectIsSaving = false;

const newProjectBtn = document.querySelector(
  "#newprojectbtn",
) as HTMLButtonElement;

const projectContainer = document.querySelector(
  "#projectContainer",
) as HTMLDivElement;

// Visar projektformuläret, kopplar knapparna och hämtar medlemmarna.
function openProjectBox() {
  if (projectIsSaving === true) {
    return;
  }

  projectContainer.innerHTML = `
    <div class="formOverlay">
      <div class="formBox">
        <h2>New project</h2>

        <label for="projectTitle">Title</label>
        <input
          id="projectTitle"
          type="text"
          placeholder="Enter the project title"
        />

        <label for="projectDescription">Description</label>
        <textarea
          id="projectDescription"
          placeholder="Describe the project"
        ></textarea>

        <label for="projectDeadline">Deadline</label>
        <input id="projectDeadline" type="date" />

        <h3>Members</h3>
        <div id="projectMemberOptions"></div>

        <p id="projectMessage"></p>

        <button id="addProjectBtn" type="button">Add project</button>

        <button id="closeProjectBtn" type="button">Close</button>
      </div>
    </div>
  `;

  const closeProjectBtn = document.querySelector(
    "#closeProjectBtn",
  ) as HTMLButtonElement;

  closeProjectBtn.addEventListener("click", closeProjectBox);

  const addProjectBtn = document.querySelector(
    "#addProjectBtn",
  ) as HTMLButtonElement;

  addProjectBtn.addEventListener("click", checkProject);

  loadProjectMembers();
}

// Stänger projektformuläret
function closeProjectBox() {
  if (projectIsSaving === true) {
    return;
  }

  projectContainer.innerHTML = "";
}

newProjectBtn.addEventListener("click", openProjectBox);

// Stänger rutan när användaren klickar utanför den.
projectContainer.addEventListener("click", (event) => {
  const background = projectContainer.querySelector(".formOverlay");

  if (event.target === background) {
    closeProjectBox();
  }
});

// Hämtar medlemmarna från Firebase och visar dem som kryssrutor.
async function loadProjectMembers() {
  const memberOptions = document.querySelector(
    "#projectMemberOptions",
  ) as HTMLDivElement;

  const message = document.querySelector(
    "#projectMessage",
  ) as HTMLParagraphElement;

  const addProjectBtn = document.querySelector(
    "#addProjectBtn",
  ) as HTMLButtonElement;

  addProjectBtn.disabled = true;
  message.textContent = "Loading members...";

  try {
    const membersRef = ref(db, "members");
    const snapshot = await get(membersRef);
    const members = snapshot.val();

    if (members === null) {
      message.textContent = "There are no members. Save a member first.";

      return;
    }

    // Skapar en kryssruta för varje medlem som hämtats från Firebase.
    for (const memberId in members) {
      const member = members[memberId];

      const label = document.createElement("label");
      label.className = "projectMemberRow";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "projectMemberCheckbox";
      checkbox.value = memberId;

      const memberName = document.createElement("span");
      memberName.textContent = capitalizeFirstLetter(member.name);

      label.append(checkbox);
      label.append(memberName);

      memberOptions.append(label);
    }

    message.textContent = "";
    addProjectBtn.disabled = false;
  } catch {
    message.textContent =
      "Members could not be loaded. Close the box and try again.";
  }
}

// Skapar projektet
async function saveProject(
  name: string,
  description: string,
  deadline: string,
  selectedMembers: string[],
) {
  const message = document.querySelector(
    "#projectMessage",
  ) as HTMLParagraphElement;

  const addProjectBtn = document.querySelector(
    "#addProjectBtn",
  ) as HTMLButtonElement;

  projectIsSaving = true;
  addProjectBtn.disabled = true;

  message.textContent = "Saving project...";

  setTimeout(async () => {
    try {
      const projectsRef = ref(db, "projects");
      const newProjectRef = push(projectsRef);
      const projectId = newProjectRef.key;

      if (projectId === null) {
        message.textContent = "Could not create the project. Try again.";

        projectIsSaving = false;
        addProjectBtn.disabled = false;

        return;
      }

      const project = new Project(
        projectId,
        name,
        description,
        deadline,
        selectedMembers,
      );

      // Samla alla ändringar innan något sparas.
      const changes = {};

      // Gå igenom en vald medlem i taget.
      for (let i = 0; i < selectedMembers.length; i++) {
        const memberId = selectedMembers[i];

        const memberRef = ref(db, "members/" + memberId);
        const snapshot = await get(memberRef);
        const member = snapshot.val();

        if (member === null) {
          message.textContent =
            "A selected member no longer exists. Close the box and try again.";

          projectIsSaving = false;
          addProjectBtn.disabled = false;

          return;
        }

        const selectedMember = new Member(
          memberId,
          member.name,
          member.categories,
          member.ongoingTasks,
          member.projects,
        );

        // Lägg det nya projektets id i medlemmens lista
        selectedMember.addProject(projectId, changes);
      }

      // Spara projektet och medlemskopplingarna tillsammans.
      await project.save(changes);

      projectIsSaving = false;

      closeProjectBox();
    } catch {
      message.textContent =
        "The project could not be saved. Check your connection and try again.";

      projectIsSaving = false;
      addProjectBtn.disabled = false;
    }
  }, 1500);
}

// Kontrollerar projektets fält och valda medlemmar innan sparandet.
function checkProject() {
  if (projectIsSaving === true) {
    return;
  }

  const titleInput = document.querySelector(
    "#projectTitle",
  ) as HTMLInputElement;

  const descriptionInput = document.querySelector(
    "#projectDescription",
  ) as HTMLTextAreaElement;

  const deadlineInput = document.querySelector(
    "#projectDeadline",
  ) as HTMLInputElement;

  const memberCheckboxes = document.querySelectorAll(".projectMemberCheckbox");

  const message = document.querySelector(
    "#projectMessage",
  ) as HTMLParagraphElement;

  const title = capitalizeFirstLetter(titleInput.value);
  const description = descriptionInput.value.trim();
  const deadline = deadlineInput.value;

  let selectedMemberCount = 0;

  const selectedMembers: string[] = [];

  message.textContent = "";

  if (title === "") {
    message.textContent = "Enter a project title.";
    return;
  }

  if (description === "") {
    message.textContent = "Enter a description.";
    return;
  }

  // Kontrollen för deadline behövs fixas, ej hunnit med!
  if (deadline === "") {
    message.textContent = "Choose a deadline.";
    return;
  }

  // Räknar de valda medlemmarna
  for (let i = 0; i < memberCheckboxes.length; i++) {
    const checkbox = memberCheckboxes[i] as HTMLInputElement;

    if (checkbox.checked === true) {
      selectedMemberCount++;

      selectedMembers.push(checkbox.value);
    }
  }

  if (selectedMemberCount === 0) {
    message.textContent = "Choose at least one member.";
    return;
  }

  message.textContent = "The information is ready to save.";

  saveProject(title, description, deadline, selectedMembers);
}
