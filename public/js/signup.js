// this is signup fucntionality

// selecting elements in statSignup1.pug by their IDs/Classes
const signupForm = document.querySelector(".signup-form");
const signupFirstNameInput = document.getElementById("firstName");
const signupLastNameInput = document.getElementById("lastName");
const signupEmailInput = document.getElementById("email");
const signupPasswordInput = document.getElementById("password");
const signupPasswordConfirmInput = document.getElementById("passwordConfirm");

// signup function and its parameters
const signup = async (
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    // send POST req using axios to API (authController)
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
    // if successful show a message to the user and then redirect to the dashboard
    if (res.data.status === "success") {
      alert("Signed up successfully");
      const redirectUrl = res.data.data.redirectUrl;
      window.setTimeout(() => {
        location.assign(redirectUrl);
      }, 1500);
    }
    // handle any errors
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
// event listener to the signupForm
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // recieves the input values and calls the signup function
  const firstName = signupFirstNameInput.value;
  const lastName = signupLastNameInput.value;
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;
  signup(firstName, lastName, email, password, passwordConfirm);
});
