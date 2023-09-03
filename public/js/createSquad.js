document.addEventListener("DOMContentLoaded", () => {
  const createSquadForm = document.getElementById("create-squad-form");
  const errorMessage = document.getElementById("error-message");

  if (createSquadForm) {
    createSquadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(createSquadForm);
      const name = formData.get("name");

      try {
        const response = await axios.post("/api/v1/squads/createSquad", {
          name,
        });

        if (response.data.status === "success") {
          alert("Squad created successfully!");
          window.location.href = "/viewSquads";
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessageText = error.response.data.error;
          errorMessage.textContent = errorMessageText;
          errorMessage.style.display = "block";
        } else {
          errorMessage.textContent =
            "An error occurred while creating the squad.";
          errorMessage.style.display = "block";
        }
      }
    });
  }
});
