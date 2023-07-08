const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/logout", // Use a relative URL
    });
    if (res.data.status === "success") {
      // Show success message
      alert("Logged out successfully");
      location.assign(res.data.redirectUrl);
    }
  } catch (err) {
    showAlert("error", "Error logging out. Try again!");
  }
};

const logOutBtn = document.querySelector("#logout a.nav__el");
if (logOutBtn) logOutBtn.addEventListener("click", logout);
