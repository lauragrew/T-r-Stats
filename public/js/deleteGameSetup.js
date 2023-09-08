// JS function to delete a game setup
function deleteGameSetup(gameSetupId) {
  console.log("Deleting gameSetupId:", gameSetupId);
  // using axios to make a delete request to the server
  axios
    .delete(`/api/v1/gameSetups/${gameSetupId}`)
    .then((response) => {
      console.log("Response data:", response.data);
      // reload the page to see the updated list of game setups
      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting game setup:", error);
      // show error message to the user
      alert("Error deleting game setup. Please try again.");
    });
}
