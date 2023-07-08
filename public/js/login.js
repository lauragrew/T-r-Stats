const loginForm = document.querySelector(".login-form");
const loginEmailInput = document.getElementById("email");
const loginPasswordInput = document.getElementById("password");
//const logOutBtn = document.querySelector("#logout a.nav__el");

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
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  login(email, password);
});

// if (logOutBtn) logOutBtn.addEventListener("click", logout);

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "http://localhost:3000/api/v1/users/logout",
//     });
//     if (res.data.status === "success") {
//       location.assign(res.data.redirectUrl);
//     }
//   } catch (err) {
//     showAlert("error", "Error logging out. Try again!");
//   }
// };
