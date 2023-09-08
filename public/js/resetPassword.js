// JS fucntion for reseting the password - not implemented yet

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");

  const resetForm = document.querySelector(".reset-password-form");
  if (!resetForm) {
    console.error("Reset form not found.");
    return;
  }

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Form submitted");

    const password = resetForm.querySelector("#password").value;
    const passwordConfirm = resetForm.querySelector("#passwordConfirm").value;
    const tokenInput = resetForm.querySelector('input[name="token"]');

    if (!tokenInput) {
      console.error("Token input not found.");
      return;
    }

    const token = tokenInput.value;

    console.log("Password:", password);
    console.log("Password Confirm:", passwordConfirm);
    console.log("Token:", token);

    try {
      // Send PATCH request to reset password
      const res = await axios.patch(`/api/v1/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });

      console.log("Response:", res.data);

      if (res.data.status === "success") {
        alert("Password reset successfully!");
        // redirect to the dashboard or login page
        window.location.href = "/statsLogin";
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  });
});
