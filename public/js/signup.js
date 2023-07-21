const signupForm = document.querySelector(".signup-form");
const signupFirstNameInput = document.getElementById("firstName");
const signupLastNameInput = document.getElementById("lastName");
const signupEmailInput = document.getElementById("email");
const signupPasswordInput = document.getElementById("password");
const signupPasswordConfirmInput = document.getElementById("passwordConfirm");

const signup = async (
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/signup",
      data: {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      alert("Signed up successfully");
      const redirectUrl = res.data.data.redirectUrl; // Get the redirect URL from the response
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

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = signupFirstNameInput.value;
  const lastName = signupLastNameInput.value;
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;
  signup(firstName, lastName, email, password, passwordConfirm);
});
