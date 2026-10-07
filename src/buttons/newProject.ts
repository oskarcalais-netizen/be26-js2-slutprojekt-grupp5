import { get, ref } from "firebase/database";
import { db } from "../firebaseconfig";

const newProjectBtn = document.querySelector(
  "#newprojectbtn",
) as HTMLButtonElement;

const projectContainer = document.querySelector(
  "#projectContainer",
) as HTMLDivElement;

// Creates the project box.
function openProjectBox() {
  projectContainer.innerHTML = `
    <div class="formOverlay">
      <div class="formBox">
        <h2>New project</h2>

        <label for="projectName">Name</label>
        <input
          id="projectName"
          type="text"
          placeholder="Enter the project name"
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

// Closes the project box.
function closeProjectBox() {
  projectContainer.innerHTML = "";
}

newProjectBtn.addEventListener("click", openProjectBox);

// Closes the "New project" box when the user clicks outside it.
projectContainer.addEventListener("click", (event) => {
  const background = projectContainer.querySelector(".formOverlay");

  if (event.target === background) {
    closeProjectBox();
  }
});

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

    for (const memberId in members) {
      const member = members[memberId];

      const label = document.createElement("label");
      label.className = "projectMemberRow";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "projectMemberCheckbox";
      checkbox.value = memberId;

      const memberName = document.createElement("span");
      memberName.textContent = member.name;

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

function checkProject() {
  const nameInput = document.querySelector("#projectName") as HTMLInputElement;

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

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const deadline = deadlineInput.value;

  let selectedMemberCount = 0;

  message.textContent = "";

  if (name === "") {
    message.textContent = "Enter a project name.";
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

  // if (deadlineInput.checkValidity() === false) {
  //   message.textContent = "Choose a valid deadline.";
  //   return;
  // }

  for (let i = 0; i < memberCheckboxes.length; i++) {
    const checkbox = memberCheckboxes[i] as HTMLInputElement;

    if (checkbox.checked === true) {
      selectedMemberCount = selectedMemberCount + 1;
    }
  }

  if (selectedMemberCount === 0) {
    message.textContent = "Choose at least one member.";
    return;
  }

  message.textContent = "The information is ready to save.";
}
