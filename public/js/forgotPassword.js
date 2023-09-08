// asd a click event listener to the "Forgot Password" link in the statsLogin page
const forgotPasswordLink = document.querySelector("#forgot-password-link");
forgotPasswordLink.addEventListener("click", () => {
  window.location.href = "/forgotPassword";
});
