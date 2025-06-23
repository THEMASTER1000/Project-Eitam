window.addEventListener("DOMContentLoaded", () => {
  const showPopupBtn = document.querySelector(".login-btn") || document.querySelector(".standalone-login-btn");
  const formPopup = document.querySelector(".form-popup");
  const hidePopupBtn = document.querySelector(".form-popup .close-btn");
  const signupLoginLinks = document.querySelectorAll(".bottom-link a");
 
  window.addEventListener('load', () => {
    document.body.classList.add("show-popup");
  });

  // Toggle between login and signup forms
  signupLoginLinks?.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const formWrapper = document.querySelector(".form-popup");
      const isSignup = link.id === "signup-link";
      formWrapper.classList.toggle("show-signup", isSignup);
    });
  });

  // Handle login form
  const loginForm = document.getElementById("login-form");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message || "Successfully logged in!");
        localStorage.setItem("userId", data.userId);
        window.location.href = "/list";
      } else {
        console.error(data.error || "Login error.");
      }
    } catch (err) {
      console.error("Server error: " + err.message);
    }
  });

  // Handle signup form
  const signupForm = document.getElementById("signup-form");
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm["confirm-password"].value;

    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const username = email.split("@")[0];

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message || "Successfully registered!");
        localStorage.setItem("userId", data.userId);
        window.location.href = "/list";
      } else {
        console.error(data.error || "Signup error.");
      }
    } catch (err) {
      console.error("Server error: " + err.message);
    }
  });
});
