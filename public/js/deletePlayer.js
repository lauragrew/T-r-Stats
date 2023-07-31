document.addEventListener("DOMContentLoaded", () => {
  const deletePlayerForms = document.querySelectorAll(".delete-player-form");

  deletePlayerForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const playerId = form.dataset.playerId;
      const squadId = form.dataset.squadId;

      try {
        const response = await fetch(`/api/v1/players/${playerId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.status === "success") {
          // Player deleted successfully, redirect to viewPlayers page for the squad
          window.location.href = `/viewPlayers/${squadId}`;
        } else {
          // Handle error (optional)
          console.log(data.error);
        }
      } catch (error) {
        // Handle error (optional)
        console.log(error);
      }
    });
  });
});
