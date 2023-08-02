async function deleteSquad(squadId) {
  try {
    console.log("Deleting squad with ID:", squadId); // Add this console log

    const confirmed = confirm("Are you sure you want to delete this squad?");
    if (!confirmed) return;

    // Send a DELETE request to your backend API to delete the squad
    const response = await fetch(`/api/v1/squads/${squadId}`, {
      method: "DELETE",
    });

    console.log("Response status:", response.status); // Add this console log
    console.log("Response body:", await response.json()); // Add this console log

    if (response.ok) {
      // If the deletion is successful, reload the page to update the squad list
      window.location.reload();
    } else {
      console.error("Failed to delete squad.");
    }
  } catch (error) {
    console.error("Error deleting squad:", error);
  }
}
