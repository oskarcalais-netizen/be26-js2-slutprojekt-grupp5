import { categories } from "../types/types";

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

        <label for="memberCategory">Category</label>

        <select id="memberCategory">
          <option value="" disabled selected>Choose a category</option>
        </select>

        <p id="memberMessage"></p>

        <button id="addMemberBtn" type="button">Add member</button>

        <button id="closeMemberBtn" type="button">Close</button>
      </div>
    </div>
  `;

  const memberCategory = document.querySelector(
    "#memberCategory",
  ) as HTMLSelectElement;

  // Loopen tar en kategori från types.ts i taget och skapar ett alternativ
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");

    option.value = categories[i];
    option.textContent = categories[i];

    memberCategory.append(option);
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

function checkMember() {
  const nameInput = document.querySelector("#memberName") as HTMLInputElement;

  const categoryInput = document.querySelector(
    "#memberCategory",
  ) as HTMLSelectElement;

  const message = document.querySelector(
    "#memberMessage",
  ) as HTMLParagraphElement;

  const name = nameInput.value.trim();
  const category = categoryInput.value;

  message.textContent = "";

  if (name === "") {
    message.textContent = "Enter a name.";
    return;
  }

  if (category === "") {
    message.textContent = "Choose a category.";
    return;
  }

  message.textContent = "The information is ready to save.";
}
