document.addEventListener("DOMContentLoaded", () => {
  const addPlayerForm = document.getElementById("add-player-form");

  if (addPlayerForm) {
    // Add a submit event listener to the form to handle form submission
    addPlayerForm.addEventListener("submit", () => {
      // Hide the success message when the form is submitted (if it exists)
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.style.display = "none";
      }
    });
  }
});
