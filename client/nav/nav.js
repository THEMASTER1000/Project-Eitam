
class CustomNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Attach shadow root
  }

  async connectedCallback() {
    try {
      const response = await fetch("/nav.html");
      const html = await response.text();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const template = tempDiv.querySelector("#nav-template");
      if (!template) return;

      const navContent = template.content.cloneNode(true);

      // ⬇ Load nav.css inside the shadow DOM
      const styleLink = document.createElement("link");
      styleLink.setAttribute("rel", "stylesheet");
      styleLink.setAttribute("href", "./nav.css");

      this.shadowRoot.appendChild(styleLink);
      this.shadowRoot.appendChild(navContent);

      this.updateNav();
      this.setupBurgerMenu();
    } catch (err) {
      console.error("Error loading navbar:", err);
    }
  }

  updateNav() {
    const loginLink = this.shadowRoot.querySelector("#loginLink");
    const logoutLink = this.shadowRoot.querySelector("#logoutLink");
    const listLink = this.shadowRoot.querySelector("#listLink");
    const userId = localStorage.getItem("userId");

    if (userId) {
      loginLink.style.display = "none";
      logoutLink.style.display = "inline";
      listLink.style.display = "inline";

      logoutLink.onclick = () => {
        localStorage.removeItem("userId");
        window.location.href = "./login";
      };
    } else {
      loginLink.style.display = "inline";
      logoutLink.style.display = "none";
      listLink.style.display = "none";
    }
  }

  setupBurgerMenu() {
    const burger = this.shadowRoot.querySelector(".burger");
    const navLinks = this.shadowRoot.querySelector(".nav-links");

    burger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }
}

customElements.define("custom-nav", CustomNav);