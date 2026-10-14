import { categories } from "../types/types";
import { Member } from "../classes/Member";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

import { push, ref } from "firebase/database";
import { db } from "../firebaseconfig";

let memberIsSaving = false;

const newMemberBtn = document.querySelector(
  "#newmemberbtn",
) as HTMLButtonElement;

const memberContainer = document.querySelector(
  "#memberContainer",
) as HTMLDivElement;

// SHOWS FORM FOR NEW MEMBER AND CONNECTS BUTTONS TO THEIR RESPECTIVE FUNCTIONS
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

  // LOOPS CATEGORIES FROM 'types.ts' AND CREATES AN OPTION
  for (let i = 0; i < categories.length; i++) {
    categoryContainer.innerHTML += `
    <label class= "projectMemberRow">
      <input type="checkbox" class="memberCategoryCheckbox" value="${categories[i]}">
      ${categories[i]}
    </label>
  `;
  }

  // THE BUTTON NOW EXISTS BECAUSE THE HTML HAS BEEN ADDED
  const closeMemberBtn = document.querySelector(
    "#closeMemberBtn",
  ) as HTMLButtonElement;

  closeMemberBtn.addEventListener("click", closeMemberBox);

  const addMemberBtn = document.querySelector(
    "#addMemberBtn",
  ) as HTMLButtonElement;

  addMemberBtn.addEventListener("click", checkMember);
}

// CLOSES MEMBER FORM
function closeMemberBox() {
  if (memberIsSaving === true) {
    return;
  }

  memberContainer.innerHTML = "";
}

newMemberBtn.addEventListener("click", openMemberBox);

// CLOSES THE "New member" BOX WHEN THE USER CLICKS OUTSIDE IT
memberContainer.addEventListener("click", (event) => {
  const background = memberContainer.querySelector(".formOverlay");

  if (event.target === background) {
    closeMemberBox();
  }
});

// CREATES A MEMBER, SAVES IT AND CLOSES THE FORM UPON SUCCESSFUL SAVE
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

  setTimeout(async () => {
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

      memberIsSaving = false;
      closeMemberBox();
    } catch {
      message.textContent = "The member could not be saved. Try again.";

      memberIsSaving = false;
      addMemberBtn.disabled = false;
    }
  }, 1500);
}

// CHECKS NAME AND CATEGORIES BEFORE MEMBER IS SAVED
function checkMember() {
  if (memberIsSaving === true) {
    return;
  }

  const nameInput = document.querySelector("#memberName") as HTMLInputElement;

  const message = document.querySelector(
    "#memberMessage",
  ) as HTMLParagraphElement;

  const name = capitalizeFirstLetter(nameInput.value);

  const checkboxes = document.querySelectorAll(".memberCategoryCheckbox");

  const selectedCategories: string[] = [];

  // LOOPS THROUGH CHECKBOXES AND COMPILES THE CHOSEN CATEGORIES
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
