import { categories } from "../types/types";
import { Member } from "../classes/Member";

import { push, ref } from "firebase/database";
import { db } from "../firebaseconfig";

let memberIsSaving = false;

const newMemberBtn = document.querySelector(
  "#newmemberbtn",
) as HTMLButtonElement;

const memberContainer = document.querySelector(
  "#memberContainer",
) as HTMLDivElement;

// Creates the member box.
function openMemberBox() {
  if (memberIsSaving === true) {
    return;
  }

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

        <h3>Categories</h3>

        <div id="memberCategories"></div>

        <p id="memberMessage"></p>

        <button id="addMemberBtn" type="button">Add member</button>

        <button id="closeMemberBtn" type="button">Close</button>
      </div>
    </div>
  `;

  const categoryContainer = document.querySelector(
    "#memberCategories",
  ) as HTMLDivElement;

  // Loopen tar en kategori från types.ts i taget och skapar ett alternativ
  for (let i = 0; i < categories.length; i++) {
    categoryContainer.innerHTML += `
    <label class= "projectMemberRow">
      <input type="checkbox" class="memberCategoryCheckbox" value="${categories[i]}">
      ${categories[i]}
    </label>
  `;
  }

  // The button now exists because the HTML has been added.
  const closeMemberBtn = document.querySelector(
    "#closeMemberBtn",
  ) as HTMLButtonElement;

  closeMemberBtn.addEventListener("click", closeMemberBox);

  const addMemberBtn = document.querySelector(
    "#addMemberBtn",
  ) as HTMLButtonElement;

  addMemberBtn.addEventListener("click", checkMember);
}

// Closes the member box.
function closeMemberBox() {
  if (memberIsSaving === true) {
    return;
  }

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

async function saveMember(name: string, selectedCategories: string[]) {
  const message = document.querySelector(
    "#memberMessage",
  ) as HTMLParagraphElement;

  const addMemberBtn = document.querySelector(
    "#addMemberBtn",
  ) as HTMLButtonElement;

  memberIsSaving = true;
  addMemberBtn.disabled = true;

  message.textContent = "Saving member...";

  try {
    const membersRef = ref(db, "members");
    const newMemberRef = push(membersRef);
    const memberId = newMemberRef.key;

    if (memberId === null) {
      message.textContent = "Could not create the member. Try again.";

      memberIsSaving = false;
      addMemberBtn.disabled = false;

      return;
    }

    const member = new Member(memberId, name, selectedCategories);

    await member.save();

    setTimeout(() => {
      memberIsSaving = false;
      closeMemberBox();
    }, 1000);
  } catch {
    message.textContent = "The member could not be saved. Try again.";

    memberIsSaving = false;
    addMemberBtn.disabled = false;
  }
}

function checkMember() {
  if (memberIsSaving === true) {
    return;
  }

  const nameInput = document.querySelector("#memberName") as HTMLInputElement;

  const message = document.querySelector(
    "#memberMessage",
  ) as HTMLParagraphElement;

  const name = nameInput.value.trim();

  const checkboxes = document.querySelectorAll(".memberCategoryCheckbox");

  const selectedCategories: string[] = [];
  // Kontroll som visar om kryssrutan är ikryssad
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i] as HTMLInputElement;

    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  }

  message.textContent = "";

  if (name === "") {
    message.textContent = "Enter a name.";
    return;
  }

  if (selectedCategories.length === 0) {
    message.textContent = "Choose at least one category.";
    return;
  }

  message.textContent = "The information is ready to save.";

  saveMember(name, selectedCategories);
}
