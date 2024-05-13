const icons = {
  success: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
    `,
};

const toastOpened = new Set();

class Toast extends HTMLElement {
  static tagName = "cc-toast";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :popover-open {
          position: fixed;
          inset: unset;
          bottom: var(--bottom, 5px);
          right: 5px;
          margin: 0;
          display: grid;
          grid-template-columns: max-content 1fr max-content auto;
          align-items: center;
          gap: 10px;
        }
        [popover] > :first-child {
          width: 2rem;
          height: 2rem;
          flex-shrink: 0;
          fill: white;
        }
        button {
          background: transparent;
          color: white;
          border: none;
          padding: 0;
        }
        cc-button::part(button):hover {
          background-color: darkseagreen;
        }
        [popover] {
          width: 100%;
          max-width: 35ch;
          background-color: green;
          color: white;
          border-radius: 6px;
          border: none;
          padding: 10px;
          padding-left: 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: 
            bottom 0.3s,
            opacity 0.3s,
            transform 0.3s,
            bottom 0.3s allow-discrete,
            overlay 0.3s allow-discrete,
            display 0.3s allow-discrete;
        }
        [popover]:popover-open {
          opacity: 1;
          transform: translateY(0);
        }
        @starting-style {
          [popover]:popover-open {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      </style>
      <div part="body" popover="manual">
        ${this.getIcon()} 
        <div part="content">
            <slot></slot>
        </div>
        <cc-divider theme="vertical" style="--color: white; --spacing: 0;"></cc-divider>
        <cc-button type="button" theme="icon borderless round" onclick="this.getRootNode().host.removeFromDOM()">
          <cc-icon icon="cross" style="--size: 2rem;"></cc-icon>
          <cc-visually-hidden>Close</cc-visually-hidden>
        </cc-button>
      </div>
    `;

    // TODO: need to add --hover-bg-color custom properties to cc-button
    this.popover.addEventListener("toggle", this.moveToastsUp);
  }

  moveToastsUp = (event) => {
    if (event.newState === "open") {
      toastOpened.forEach((toast) => {
        // Move up all the other toasts by 50px to make way for the new one
        const prevValue = toast.style
          .getPropertyValue("--bottom")
          .replace("px", "");
        const newValue = parseInt(prevValue) + 80;
        toast.style.setProperty("--bottom", `${newValue}px`);
        toast.classList.remove("newest");
      });

      this.classList.add("newest");
      this.style.setProperty("--bottom", `${5}px`);
      toastOpened.add(this);
    }
  };

  removeSelf = () => {
    const timeout = setTimeout(() => {
      this.popover.hidePopover();
      this.remove();
      toastOpened.delete(this);
      clearTimeout(timeout);
    }, 4000);
  };

  getIcon = () => {
    if (!Object.keys(icons).includes(this.variant)) {
      return console.warn(`"${this.variant}" is not a valid toast variant.`);
    }
    return icons[this.variant];
  };

  /**
   * @returns {HTMLElement}
   */
  get popover() {
    return this.shadowRoot.querySelector('[part="body"]');
  }

  show = () => {
    this.popover?.showPopover();
    this.removeSelf();
  };

  removeFromDOM = () => {
    const success = this.dispatchEvent(
      new CustomEvent("toast-removed", {
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    if (success) {
      this.popover?.hidePopover();
      this.remove();
    }
  };

  get variant() {
    return this.getAttribute("variant");
  }

  set variant(variant) {
    this.setAttribute("variant", variant);
  }
}

customElements.define(Toast.tagName, Toast);

export function makeToast(message, variant) {
  const toast = document.createElement("cc-toast");
  toast.variant = variant;
  toast.innerHTML = message;
  document.body.appendChild(toast);
  toast.show();
}
