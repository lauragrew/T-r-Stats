// updatePassword.js - not implemented

// function to update password
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
    } else {
      console.log("An error occurred:", data.error);
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
};
// handle  update password form submission
const form = document.querySelector(".update-password-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const passwordCurrent = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const passwordConfirm = document.getElementById("confirmPassword").value;

  await updatePassword(passwordCurrent, newPassword, passwordConfirm);
});
