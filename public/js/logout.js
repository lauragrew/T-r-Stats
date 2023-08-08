// function for logging out

const logout = async () => {
  try {
    // send GET req to logout endpoint (authController)
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/logout",
    });
    // check if logout was successful
    if (res.data.status === "success") {
      // success message if it was
      alert("Logged out successfully");
      location.assign(res.data.redirectUrl);
    }
    // handle errors
  } catch (err) {
    showAlert("error", "Error logging out. Try again!");
  }
};
// get logout button by its ID 'logout a.nav__el'
const logOutBtn = document.querySelector("#logout a.nav__el");
// if button is there add click event listener that triggers the logout function to work
if (logOutBtn) logOutBtn.addEventListener("click", logout);
