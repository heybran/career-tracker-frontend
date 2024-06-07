import { UtilsMixin } from "utils/index.js";

export default class Settings extends UtilsMixin(HTMLElement) {
    static tagName = "account-settings";
    connectedCallback() {
        this.setHTMLUnsafe(`
        <article class="narrow-content">
        <div>
          <h1>Account setting</h1>
          <p>Manage your account settings</p>
        </div>
        <cc-divider style="--spacing: 2rem;"></cc-divider>
        <form method="post" onsubmit="window.user.updateDisplayName(event);">
          <copycat-text-field>
            <template shadowrootmode="open">
                <style>
                    :host {
                        display: block;
                        --_border-width: var(--copycat-theme--form-field-border-width, 1px);
                        --_border-radius: var(--copycat-theme--form-field-border-radius, 8px);
                        --_border-color: var(--copycat-theme--form-field-border-color, #adaba8);
                        --_label-spacing: var(--copycat-theme--form-field-label-spacing, 6px);
                        --_font-weight: var(--copycat-theme--form-field-label-font-weight, normal);
                        --_color-primary: var(--copycat-theme--color-primary, #1c7ed6);
                        --_outline-offset: var(--copycat-theme--form-field-outline-offset, 4px);
                    }
                    ::slotted(input) {
                        width: 100%;
                        height: auto;
                        background: none;
                        border-radius: var(--_border-radius);
                        min-height: 0;
                        min-width: 0;
                        color: inherit;
                        outline: none;
                        padding: 1ch 1.5ch;
                        -webkit-appearance: none;
                        appearance: none;
                        font: inherit;
                        margin: 0;
                        border: var(--_border-width) solid var(--_border-color);
                        display: flex;
                        align-items: center;
                        position: relative;
                        transition: .15s cubic-bezier(.22,1,.36,1), visibility 0s;
                    }
                    ::slotted(input:focus-visible) {
                        outline: var(--_color-primary) auto 1px;
                        outline-offset: var(--_outline-offset);
                    }
                    ::slotted(label) {
                        font-weight: var(--_font-weight);
                        padding-block-end: var(--_label-spacing);
                        display: inline-block;
                    }
                </style>
                <div part="wrapper">
                    <slot name="label"></slot>
                    <slot name="input"></slot>
                </div>
            </template>
            <label slot="label" for="displayName">
              <h2 class="form-heading">Display name</h2>
              <p><small>Update display name to change what's been shown on top right corner.</small></p>
            </label>
            <input 
                slot="input" 
                type="text" 
                name="displayName" 
                id="displayName"
                value="${window.config.user.displayName || ''}"
            >
          </copycat-text-field>
          <copycat-button theme="primary" style="margin-top: 0.5rem;">
            <template shadowrootmode="open">
                <style>
                    :host {
                        position: relative;
                        display: inline-flex;
                        --_gap: var(--copycat-theme-button-gap, 0.2em);
                        --_outline-offset: var(--copycat-theme--button-outline-offset, 4px);
                        --_border-radius: var(--copycat-theme--button-border-radius, 8px);
                    }
                    :host([theme="primary"]) {
                        --_color-primary: var(--copycat-theme--color-primary, #1c7ed6);
                        --_text-color: #fff;
                    }
                    ::slotted(button) {
                        background-color: var(--_color-primary);
                        border: 1px solid var(--button-border-color, #dedbd9);
                        color: var(--_text-color, inherit);
                        cursor: pointer;
                        font: inherit;
                        margin: 0;
                        padding: 1ch 1.5ch;
                        border-radius: var(--_border-radius);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: nowrap;
                        transition: .15s cubic-bezier(.22,1,.36,1);
                        width: 100%;
                    }
                    :host([theme="primary"]) ::slotted(button),
                    :host([theme="success"]) ::slotted(button),
                    :host([theme="warning"]) ::slotted(button),
                    :host([theme="neutral"]) ::slotted(button),
                    :host([theme="danger"]) ::slotted(button) {
                        border-color: transparent;
                    }
                    ::slotted(button:focus-visible) {
                        outline: var(--_color-primary) auto 1px;
                        outline-offset: var(--_outline-offset);
                    }
                </style>
                <slot></slot>
            </template>
            <button type="submit">Update</button>
          </copycat-button>
        </form>
        <cc-divider style="--spacing: 2rem;"></cc-divider>
        <copycat-switch>
          <template shadowrootmode="open">
              <style>
                  :host {
                      display: inline-block;
                  }
                  [part="wrapper"] {
                      cursor: pointer;
                      display: inline-flex;
                      align-items: center;
                      gap: var(--copycat-switch-gap, 0.5em);
                  }
                  ::slotted(input) {
                      flex-shrink: 0;
                      margin: 0;
                      box-sizing: border-box;
                      position: relative;
                      display: inline-flex;
                      align-items: center;
                      justify-content: space-between;
                      --_border-width: var(--copycat-switch-border-width, 2px);
                      border: var(--_border-width) solid var(--copycat-switch-border-color, #adaba8);
                      --_circle-spacing: var(--copycat-switch-circle-spacing, 1px);
                      --_height: var(--copycat-switch-height, 36px);
                      height: var(--_height);
                      --_circle-size: calc(var(--_height) - (var(--_border-width) + var(--_circle-spacing)) * 2);
                      border-radius: var(--_height);
                      --_width: calc(var(--_circle-size) * 2.2);
                      width: var(--_width);
                      appearance: none;
                  }
                  ::slotted(input)::before {
                      box-sizing: border-box;
                      content: "";
                      left: var(--_circle-spacing);
                      position: absolute;
                      top: var(--_circle-spacing);
                      background-color: var(--copycat-switch-background-color, #adaba8);
                      border-radius: 1.7142857143em;
                      transform: translateX(0);
                      transition: transform .25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color .25s cubic-bezier(0.33, 1, 0.68, 1);
                      width: var(--_circle-size);
                      height: var(--_circle-size);
                  }
                  ::slotted(input:checked)::before {
                      transform: translateX(calc(var(--_width) - var(--_circle-size) - var(--_border-width) * 2 - var(--_circle-spacing) * 2));
                      background-color: var(--copycat-switch-color-primary, #1c7ed6);
                  }
                  ::slotted(input:checked) {
                      border-color: var(--copycat-switch-color-primary, #1c7ed6);
                  }
                  ::slotted(label) {
                      /* cursor: pointer; */
                      /* display: inline-flex; */
                      /* align-items: center; */
                  }
              </style>
              <div part="wrapper">
                  <slot name="input"></slot>
                  <slot name="label"></slot>
              </div>
          </template>
          <input 
            slot="input" 
            type="checkbox" 
            role="switch" 
            name="allow_password_login"  
            id="allow_password_login"
            ${this.checked(window.config.user.allowPasswordLogin)}
            onchange="this.closest('${this.localName}').allowPasswordLogin(event);"
          >
          <label slot="label" for="allow_password_login">
            <h2 class="form-heading">Allow password login</h2>
            <p><small>If you turn on password login, you will be able to login with password on top of existing email login.</small></p>
          </label>
        </copycat-switch>
        <cc-divider style="--spacing: 2rem;"></cc-divider>
        <!-- <form method="post" onsubmit="window.user.resetPassword(event);">   
          <h2 class="form-heading">Reset password</h2>
          <p><small>We will send an link to your email to reset your password.</small></p>
          <copycat-button theme="primary" style="margin-top: 0.5rem;">
            <template shadowrootmode="open">
                <style>
                    :host {
                        position: relative;
                        display: inline-flex;
                        --_gap: var(--copycat-theme-button-gap, 0.2em);
                        --_outline-offset: var(--copycat-theme--button-outline-offset, 4px);
                        --_border-radius: var(--copycat-theme--button-border-radius, 8px);
                    }
                    :host([theme="primary"]) {
                        --_color-primary: var(--copycat-theme--color-primary, #1c7ed6);
                        --_text-color: #fff;
                    }
                    ::slotted(button) {
                        background-color: var(--_color-primary);
                        border: 1px solid var(--button-border-color, #dedbd9);
                        color: var(--_text-color, inherit);
                        cursor: pointer;
                        font: inherit;
                        margin: 0;
                        padding: 1ch 1.5ch;
                        border-radius: var(--_border-radius);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: nowrap;
                        transition: .15s cubic-bezier(.22,1,.36,1);
                        width: 100%;
                    }
                    :host([theme="primary"]) ::slotted(button),
                    :host([theme="success"]) ::slotted(button),
                    :host([theme="warning"]) ::slotted(button),
                    :host([theme="neutral"]) ::slotted(button),
                    :host([theme="danger"]) ::slotted(button) {
                        border-color: transparent;
                    }
                    ::slotted(button:focus-visible) {
                        outline: var(--_color-primary) auto 1px;
                        outline-offset: var(--_outline-offset);
                    }
                </style>
                <slot></slot>
            </template>
            <button type="submit">Ok, send the link</button>
          </copycat-button>
        </form> -->
      </article>
    `);
    }

  /**
   * Allow password login on top original email login.
   * @param {Event} event 
   */
  allowPasswordLogin(event) {
    fetch(`${window.config.endpoint}` + '/users/allow-password-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ allowed: event.target.checked }),
      credentials: 'include'
    }).then((res) => res.json()).then(data => {
      window.config.user.allowPasswordLogin = event.target.checked;
    });
  }
}

customElements.define(Settings.tagName, Settings);