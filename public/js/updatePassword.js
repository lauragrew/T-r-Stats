// updatePassword.js

// Function to update password
const updatePassword = async (
  passwordCurrent,
  newPassword,
  passwordConfirm
) => {
  try {
    const response = await fetch("/api/v1/users/updateMyPassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Add your authorization header with the token here
      },
      body: JSON.stringify({
        passwordCurrent,
        password: newPassword,
        passwordConfirm,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      console.log("Password updated successfully");
      // You can redirect the user or show a success message here
    } else {
      console.log("An error occurred:", data.error);
      // Handle the error here, show error message, etc.
    }
  } catch (err) {
    console.error("An error occurred:", err);
    // Handle the error here
  }
};
// Handle form submission
const form = document.querySelector(".update-password-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const passwordCurrent = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const passwordConfirm = document.getElementById("confirmPassword").value;

  await updatePassword(passwordCurrent, newPassword, passwordConfirm);
});
