document.addEventListener("DOMContentLoaded", () => {
  // getting the login form and input fields from statsLogin.pug
  const loginForm = document.querySelector(".login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // async fucntion that takes email and password as parameters (async - non-blocking) (sync - one task at a time)
  const login = async (email, password) => {
    try {
      // send POST req to the login endpoint (authController) via axios
      const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users/login",
        data: {
          email,
          password,
        },
      });
      // success message sent if login successful and redirect to the dashboard page
      if (res.data.status === "success") {
        alert("Logged in successfully");
        const redirectUrl = res.data.data.redirectUrl;
        window.setTimeout(() => {
          location.assign(redirectUrl);
        }, 1500);
      }
      // handle errors
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  // event listener to the login form, gets the email and password values and calls login function
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    login(email, password);
  });
});
