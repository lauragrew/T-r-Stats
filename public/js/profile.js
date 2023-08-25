// profile.js

const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios.patch("/api/v1/users/updatePassword", {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    if (res.data.status === "success") {
      alert("Password updated successfully");
    }
  } catch (err) {
    alert("Error updating password: " + err.response.data.message);
  }
};

// Function to update user details
const updateDetails = async (firstName, lastName, email) => {
  try {
    const res = await axios.patch("/updateMe", {
      firstName,
      lastName,
      email,
    });

    if (res.data.status === "success") {
      // User details updated successfully
      alert("User details updated successfully");
      // You can add more logic here like updating UI
    }
  } catch (err) {
    alert("Error updating details: " + err.response.data.message);
  }
};

// Event listeners for form submissions
document
  .getElementById("updatePasswordForm")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("passwordCurrent").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    updatePassword(passwordCurrent, password, passwordConfirm);
  });

document.getElementById("updateDetailsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  updateDetails(firstName, lastName, email);
});
