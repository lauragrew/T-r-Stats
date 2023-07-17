const signupForm = document.querySelector(".signup-form");
const signupNameInput = document.getElementById("name");
const signupEmailInput = document.getElementById("email");
const signupPasswordInput = document.getElementById("password");
const signupPasswordConfirmInput = document.getElementById("passwordConfirm");

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      alert("Signed up successfully");
      window.setTimeout(() => {
        location.assign(redirectUrl); // Redirect to the gameSetup page
      }, 1500);
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      const errorMessage = err.response.data.error;
      if (errorMessage.includes("Duplicate field value")) {
        alert("Email already exists. Please use another email.");
      } else {
        alert(errorMessage);
      }
    } else {
      alert("An error occurred");
    }
  }
};
// Get the redirect URL from your backend (e.g., using a template engine)
const redirectUrl = "/gameSetup";

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = signupNameInput.value;
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;
  signup(name, email, password, passwordConfirm);
});
