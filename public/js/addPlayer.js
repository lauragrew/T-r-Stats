// JS to add a player form viewPlayers.pug
// event listener that waits for document to be fully loaded before continuing with the code inside
document.addEventListener("DOMContentLoaded", () => {
  // get the form element with the ID add-player-form in addPlayerProfile.pug
  const addPlayerForm = document.getElementById("add-player-form");

  if (addPlayerForm) {
    // add a submit event listener to the form
    addPlayerForm.addEventListener("submit", () => {
      // check if success-message element exists
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        // hide the success message
        successMessage.style.display = "none";
      }
    });
  }
});
