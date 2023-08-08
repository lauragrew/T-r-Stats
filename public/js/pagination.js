// JS for the pagination arrows that can bring pages back or forward from previous pages <>
window.addEventListener("popstate", function (event) {
  // Check if the current page is the login or signup page
  const isLoginPage = window.location.pathname === "/statsLogin";
  const isSignupPage = window.location.pathname === "/statsSignup1";

  // Check the value of the "loggedIn" cookie
  const isLoggedIn = document.cookie.includes("loggedIn=true");

  if (!isLoggedIn && !isLoginPage && !isSignupPage) {
    // If the user is not logged in and not on the login or signup page,
    // go back to the previous page
    window.history.back();
  }
});
