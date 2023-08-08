// JS to delete a player from viewPlayers.pug

document.addEventListener("DOMContentLoaded", () => {
  // get element with class delete-player-form
  const deletePlayerForms = document.querySelectorAll(".delete-player-form");
  // loop through form
  deletePlayerForms.forEach((form) => {
    // submit event listener to the form
    form.addEventListener("submit", async (event) => {
      // prevent default form submission behavior
      event.preventDefault();

      // get player and squad IDs
      const playerId = form.dataset.playerId;
      const squadId = form.dataset.squadId;

      try {
        // send delete request to delete player
        const response = await fetch(`/api/v1/players/${playerId}`, {
          method: "DELETE",
        });

        // parse response
        const data = await response.json();

        // check if player was deleted and send success message
        if (data.status === "success") {
          // Player deleted successfully, redirect to viewPlayers page
          window.location.href = `/viewPlayers/${squadId}`;
        } else {
          // Handle errors
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
});
