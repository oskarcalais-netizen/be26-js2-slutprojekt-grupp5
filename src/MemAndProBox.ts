const newMemberBtn = document.querySelector(
  "#newmemberbtn",
) as HTMLButtonElement;

const memberContainer = document.querySelector(
  "#memberContainer",
) as HTMLDivElement;

// Creates the member box.
function openMemberBox() {
  memberContainer.innerHTML = `
    <div class="formOverlay">
      <div class="formBox">
        <h2>New member</h2>

        <label for="memberName">Name</label>
        <input
          id="memberName"
          type="text"
          placeholder="Enter the member's name"
        />

        <button id="addMemberBtn" type="button">
          Add member
        </button>
        
        <button id="closeMemberBtn" type="button">
          Close
        </button>
      </div>
    </div>
  `;

  // The button now exists because the HTML has been added.
  const closeMemberBtn = document.querySelector(
    "#closeMemberBtn",
  ) as HTMLButtonElement;

  closeMemberBtn.addEventListener("click", closeMemberBox);
}

// Closes the member box.
function closeMemberBox() {
  memberContainer.innerHTML = "";
}

newMemberBtn.addEventListener("click", openMemberBox);

// Closes the "New member" box when the user clicks outside it.
memberContainer.addEventListener("click", (event) => {
  const background = memberContainer.querySelector(".formOverlay");

  if (event.target === background) {
    closeMemberBox();
  }
});

// ----------------------- Project button -----------------------

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

        <button id="addProjectBtn" type="button">
          Add project
        </button>

        <button id="closeProjectBtn" type="button">
          Close
        </button>
      </div>
    </div>
  `;

  const closeProjectBtn = document.querySelector(
    "#closeProjectBtn",
  ) as HTMLButtonElement;

  closeProjectBtn.addEventListener("click", closeProjectBox);
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
