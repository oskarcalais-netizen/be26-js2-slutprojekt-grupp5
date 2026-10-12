export const createActionButton = (
  text: string,
  onClick: () => Promise<void>,
  colorClass = "bg-indigo-600 hover:bg-indigo-500"
) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className =
    `mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${colorClass}`;

  button.addEventListener("click", async () => {
    button.disabled = true;

    try {
      await onClick();
    } catch (error) {
      console.error("Task action failed:", error);
      alert("Åtgärden misslyckades. Försök igen.");
      button.disabled = false;
    }
  });

  return button;
};