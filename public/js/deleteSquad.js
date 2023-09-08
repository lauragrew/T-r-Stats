// function to delete a squad
async function deleteSquad(squadId) {
  try {
    console.log("Deleting squad with ID:", squadId);
    // double check the user wants to delete the squad
    const confirmed = confirm("Are you sure you want to delete this squad?");
    if (!confirmed) return;

    // send a delete request to delete the squad
    const response = await fetch(`/api/v1/squads/${squadId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // if the deletion is successful, reload the page to update the squad list
      window.location.reload();
      // handle errors
    } else {
      console.error("Failed to delete squad.");
    }
  } catch (error) {
    console.error("Error deleting squad:", error);
  }
}
