  const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");
// Show mobile menu
hamburgerBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle("show-menu");
});
// Hide mobile menu
hideMenuBtn.addEventListener("click", () =>  hamburgerBtn.click());
// Show login popup
showPopupBtn.addEventListener("click", () => {
    document.body.classList.toggle("show-popup");
});
// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());
// Show or hide signup form
signupLoginLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
    });
});
loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
  
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message || "התחברת בהצלחה!");
        // ניתן לשמור טוקן או מזהה משתמש כאן:
        // localStorage.setItem("token", data.token);
        window.location.href = "list.html";
      } else {
        alert(data.error || "שגיאה בהתחברות");
      }
    } catch (err) {
      alert("שגיאה בשרת: " + err.message);
      console.error(err);
    }
  });
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupForm.querySelector('input[name="email"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;
    const confirmPassword = signupForm.querySelector('input[name="confirm-password"]').value;

    // בדיקת סיסמה כמו שכבר יש בקוד שלך
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // צור שם משתמש מהאימייל (או תוכל להוסיף שדה נפרד לטופס)
    const username = email.split('@')[0];

    try {
        const response = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "נרשמת בהצלחה!");
            formPopup.classList.remove("show-signup"); // חזור למסך התחברות
        } else {
            alert(data.error || "שגיאה בהרשמה");
        }
    } catch (err) {
        alert("שגיאה בשרת: " + err.message);
        console.error(err);
    }
});
