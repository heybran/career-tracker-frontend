import { UtilsMixin, toast } from "../../utils";

export default class SignUp extends UtilsMixin(HTMLElement) {
  static tagName = "sign-up";
  connectedCallback() {
    this.innerHTML = `
            <div class="content" part="content">
            <h1>
            <img src="/career-tracker.svg" alt="Career Tracker Logo" class="logo">
            <cc-visually-hidden>Career Tracker</cc-visually-hidden>
          </h1>
          <form method="post" onsubmit="this.closest('${this.localName}').signup(event);" id="signup-form" class="form-wrapper">
            <p>Hi there, welcome! You can signup for an account by entering your email address, a signup link will be sent to your inbox.</p>
            <div>
                <sp-field-label for="email_address">Email address</sp-field-label>
                <sp-textfield id="email_address" name="email" type="email" required></sp-textfield>
            </div>
            <sp-button size="m" type="submit" style="margin-top: 0.5rem;">Continue</sp-button>
            <small><p>Already have an account? <a href="/signin">Sign in here</a>.</p></small>
            <!-- <cc-divider text="Or"></cc-divider>
            <cc-button style="display: flex;">
              <img src="/github.svg" width="24" height="24" style="margin-right: 0.5rem;">
              Continue with Github
            </cc-button> -->
          </form>
            </div>
        `;
  }

  signup = (event) => {
    event.preventDefault();
    const form = event.target;
    const error = form.querySelector(".error");
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.pending = true;

    fetch(window.config.endpoint + "/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: form.querySelector('[name="email"]').value,
        clientURL: location.origin + "/activate-account",
      }),
    })
      .then((res) => {
        // Handle the response from the server
        if (res.ok) {
          toast.success(
            `
            An activation link has been sent to your email address.
            Please check your inbox to proceed, and you can close this browser tab now.
          `,
            true
          );
        } else {
          const p = document.createElement("p");
          p.style.color = "red";
          p.className = "error";
          if (res.status === 400) {
            const modal = document.createElement("cc-dialog");
            modal.setAttribute(
              "label",
              "User already exists with this email address."
            );
            modal.innerHTML = `
            <p>There is an user account under this email address already. Redirect you to signin form?</p>
            <cc-button slot="footer-actions-right" theme="primary" onclick="ROUTER.redirect('/signin'); this.parentElement.close()">Ok</cc-button>
          `;
            document.body.appendChild(modal);
            customElements.whenDefined("cc-dialog").then(() => modal.show());
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
}

customElements.define(SignUp.tagName, SignUp);
