document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const login = async (email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users/login",
        data: {
          email,
          password,
        },
      });
      if (res.data.status === "success") {
        alert("Logged in successfully");
        const redirectUrl = res.data.data.redirectUrl; // Get the redirect URL from the response
        window.setTimeout(() => {
          location.assign(redirectUrl); // Redirect to the dashboard page
        }, 1500);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  // // Get the redirect URL from your backend (e.g., using a template engine)
  //const redirectUrl = "/dashboard";

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    login(email, password);
  });
});
