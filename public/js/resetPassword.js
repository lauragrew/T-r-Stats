document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired"); // Debugging

  const resetForm = document.querySelector(".reset-password-form");
  if (!resetForm) {
    console.error("Reset form not found."); // Debugging
    return;
  }

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Form submitted"); // Debugging

    const password = resetForm.querySelector("#password").value;
    const passwordConfirm = resetForm.querySelector("#passwordConfirm").value;
    const tokenInput = resetForm.querySelector('input[name="token"]');

    if (!tokenInput) {
      console.error("Token input not found."); // Debugging
      return;
    }

    const token = tokenInput.value;

    console.log("Password:", password); // Debugging
    console.log("Password Confirm:", passwordConfirm); // Debugging
    console.log("Token:", token); // Debugging

    try {
      // Send PATCH request to reset password
      const res = await axios.patch(`/api/v1/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });

      console.log("Response:", res.data); // Debugging

      if (res.data.status === "success") {
        alert("Password reset successfully!");
        // Redirect to the dashboard or login page
        window.location.href = "/statsLogin";
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  });
});
