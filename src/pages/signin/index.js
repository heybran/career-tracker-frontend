import { toast } from "utils/index.js";

export default class Signin extends HTMLElement {
  static tagName = "sign-in";

  signin = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const error = form.querySelector(".error");
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute("loading", "");

    fetch(window.config.endpoint + "/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: formData.get("email"),
        clientURL: location.origin + "/login-via-email",
      }),
    })
      .then(async (res) => {
        // Handle the response from the server
        if (res.ok) {
          toast.success((await res.json()).message, {
            persist: true,
          });
        } else {
          const p = document.createElement("p");
          p.style.color = "red";
          p.className = "error";
          if (!res.ok) {
            p.textContent = (await res.json()).message;
            form
              .querySelector('[name="email"]')
              .insertAdjacentElement("afterend", p);
          }
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
      })
      .finally(() => {
        submitButton?.removeAttribute("loading");
      });
  };

  /**
   * Sign in with email & password if allow password login is set to true.
   * @param {SubmitEvent} event
   */
  signinWithPassword = async (event) => {
    event.preventDefault();
    const form = event.target;
    const existingErrors = form.querySelectorAll(".error");
    if (existingErrors) {
      existingErrors.forEach((error) => error.remove());
    }
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.setAttribute("loading", true);
    const formData = new FormData(form);
    fetch(window.config.endpoint + "/users/signin-with-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then(async (res) => {
        // Handle the response from the server
        if (res.ok) {
          toast.success("Logged in successfully. Redirecting you to /jobs...");
          await new Promise((resolve) => setTimeout(resolve, 3000));
          location.href = "/jobs";
        } else {
          // TODO
          const errors = await res.json();
          const p = document.createElement("p");
          p.style.color = "red";
          p.className = "error";
          if (errors.code === "unknown_email") {
            p.textContent = errors.message;
            form
              .querySelector("[name=email]")
              .insertAdjacentElement("afterend", p);
          } else if (errors.code === "incorrect_password") {
            p.textContent = errors.message;
            form
              .querySelector("[name=password]")
              .insertAdjacentElement("afterend", p);
          }
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
      })
      .finally(() => {
        submitButton.removeAttribute("loading");
      });
  };

  connectedCallback() {
    this.innerHTML = `
      <h1>
        <img src="/public/career-tracker.svg" alt="Career Tracker Logo" class="logo">
        <cc-visually-hidden>Career Tracker</cc-visually-hidden>
      </h1>
      <div class="form-wrapper">
        <form method="post" onsubmit="this.closest('${this.localName}').signin(event);">
          <p>Welcome back! Enter your email which you used to register the account, and a login link will be sent to your inbox.</p>
          <cc-email-field label="Email address" name="email" required></cc-email-field>
          <cc-button type="submit" theme="primary" style="margin-top: 0.5rem;">Submit</cc-button>
        </form>
        <cc-divider text="Or"></cc-divider>
        <form method="post" onsubmit="this.closest('${this.localName}').signinWithPassword(event);">
          <p>Signin with email and password</p>
          <cc-email-field label="Email address" name="email" required></cc-email-field>
          <cc-password-field label="Password" name="password" required></cc-password-field>
          <cc-button type="submit" theme="primary" style="margin-top: 0.5rem;">Submit</cc-button>
        </form>
        <small><p>Do not have an account? <a href="/signup">Sign up here</a>.</p></small>
      </div>
    `;
  }
}

customElements.define(Signin.tagName, Signin);
