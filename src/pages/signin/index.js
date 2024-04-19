export default class Signin extends HTMLElement {
  static tagName = "sign-in";

  /**
   * Sign in with email & password if allow password login is set to true.
   * @param {SubmitEvent} event
   */
  signinWithPassword = (event) => {
    event.preventDefault();
    const form = event.target;
    // form.querySelector(".error")?.remove();
    const values = Array.from(form.querySelectorAll("[name]")).reduce(
      (acc, elem) => {
        acc[elem.getAttribute("name")] = elem.value;
        return acc;
      },
      {}
    );
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.pending = true;
    fetch(window.config.endpoint + "/users/signin-with-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        // Handle the response from the server
        if (res.ok) {
          // Show a success modal here about email is sent
          location.href = "/jobs";
        } else {
          const p = document.createElement("p");
          p.style.color = "red";
          p.className = "error";
          if (!res.ok) {
            p.innerHTML = (await res.json()).message;
          }
          // p.textContent = 'Incorrect username or password.';
          form.appendChild(p);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
      })
      .finally(() => {
        submitButton.pending = false;
      });
  };

  connectedCallback() {
    this.innerHTML = `
        <h1>
          <img src="/career-tracker.svg" alt="Career Tracker Logo" class="logo">
          <cc-visually-hidden>Career Tracker</cc-visually-hidden>
        </h1>
        <div class="form-wrapper">
          <form method="post" onsubmit="window.user.signin(event);" id="signin-form">
            <p>Welcome back! Enter your email which you used to register the account, and a login link will be sent to your inbox.</p>
            <div>
              <sp-field-label for="email_address">Email address</sp-field-label>
              <sp-textfield id="email_address" name="email" type="email" required></sp-textfield>
            </div>
            <sp-button size="m" type="submit" style="margin-top: 0.5rem;">Ok, send me the link</sp-button>
          </form>
          <cc-divider text="Or"></cc-divider>
          <form method="post" onsubmit="this.closest('${this.localName}').signinWithPassword(event);">
            <p>Signin with email and password</p>
            <div>
              <sp-field-label for="email">Email address</sp-field-label>
              <sp-textfield id="email" name="email" type="email" required></sp-textfield>
            </div>
            <div>
            <sp-field-label for="password">Password</sp-field-label>
            <sp-textfield id="password" name="password" type="password" required></sp-textfield>
            </div>
            <sp-button size="m" type="submit" style="margin-top: 0.5rem;">Submit</sp-button>
          </form>
          <small><p>Do not have an account? <a href="/signup">Sign up here</a>.</p></small>
        </div>
        `;
  }
}

customElements.define(Signin.tagName, Signin);
