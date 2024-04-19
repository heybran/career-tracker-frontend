export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    document.body.classList.add("hidrated");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        header {
          display: grid;
          align-items: center;
          grid-template-columns: max-content min-content auto auto;
          gap: 1rem;
          padding: 1rem var(--mobile-inline-padding, 2rem);
          border-bottom: 1px solid #e6e6e6;
          background-color: #fff;
          z-index: 11;
        }
        a {
          text-decoration: none;
          color: inherit;
          width: 12em;
          min-width: 120px;
        }
        img {
          width: 100%;
        }
        h1 {
          margin: 0;
        }
        cc-popover-wrapper {
          margin-left: auto;
        }
        cc-popover {
          width: 15em;
          padding: 1rem;
        }
        ul {
          list-style: ' ';
          margin: 0;
          padding: 0;
        }
        li + li {
          margin-top: .5rem;
        }
        cc-button#open-nav {
          display: none;
        }
        cc-side-nav::part(children) {
          align-items: center;
        }
        cc-side-nav-item[onclick] {
          display: none;
        }
        cc-side-nav-item {
          --link-hover-color: var(--primary-color);
        }
        .side-nav-wrapper {
          display: flex;
          align-items: center;
        }
        @media (max-width: 800px) {
          .side-nav-wrapper {
            position: fixed;
            left: 0;
            background: white;
            padding: 1rem;
            bottom: 0;
            top: 0;
            border-right: 1px solid #eee;
            transform: translateX(-100%);
            transition: 0.3s;
            flex-direction: column;
            z-index: 1;
            align-items: flex-start;
            gap: 1rem;
          }
          cc-side-nav-item[onclick] {
            display: initial;
          }
          header.nav-opened .side-nav-wrapper {
            transform: translateX(0);
          }
          cc-side-nav::part(children) {
            flex-direction: column;
          }
          cc-button#open-nav {
            display: initial;
          }
          cc-divider {
            display: none;
          }
        }
      </style>
      <header>
        <a href="/">
          <cc-visually-hidden>Visit Career Tracker Homepage</cc-visually-hidden>
          <img src="/career-tracker.svg" alt="Career Tracker Logo" role="img">
        </a>
        <cc-divider theme="vertical"></cc-divider>
        <cc-button id="open-nav" onclick="this.parentElement.classList.add('nav-opened')">Menu</cc-button>
        <div class="side-nav-wrapper">
          <cc-side-nav horizontal>
            <cc-side-nav-item onclick="this.closest('header').classList.remove('nav-opened')">
              <cc-icon icon="cross" slot="prefix"></cc-icon>
              Close menu
            </cc-side-nav-item>
            <cc-side-nav-item path="/jobs/add">
              <cc-icon icon="plus-lg" slot="prefix"></cc-icon>
              Add a Job
            </cc-side-nav-item>
            <cc-side-nav-item path="/jobs">
              <cc-icon icon="table" slot="prefix"></cc-icon>
              Jobs
            </cc-side-nav-item>
          </cc-side-nav>
        </div>
        <sp-action-menu label="Account" placement="bottom-end" style="margin-inline-start: auto;" quiet>
          <sp-menu-item>Account Settings</sp-menu-item>
          <sp-menu-item>My Profile</sp-menu-item>
          <sp-menu-divider></sp-menu-divider>
          <sp-menu-item>Share</sp-menu-item>
          <sp-menu-divider></sp-menu-divider>
          <sp-menu-item>Help</sp-menu-item>
          <sp-menu-item onclick="this.getRootNode().host.signout(this)">Sign Out</sp-menu-item>
        </sp-action-menu>
      </header>
    `;
  }

  signout = (button) => {
    fetch(window.config.endpoint + "/users/signout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

customElements.define('cc-header', Header);
