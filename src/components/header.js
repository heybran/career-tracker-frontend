export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
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
          <img src="/public/career-tracker.svg" alt="Career Tracker Logo" role="img">
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
        ${
          window.config?.user
            ? `
          <cc-popover-wrapper>
            <cc-button slot="trigger">
              ${window.config.user?.displayName || window.config.user.email}
              <cc-icon icon="chevron-down" slot="suffix"></cc-icon>
            </cc-button>
            <cc-popover placement="bottom-end">
              <ul>
                <li>
                  <cc-button style="width: 100%" href="/account/settings">Settings</cc-button>
                </li>
                <li>
                  <cc-button style="width: 100%" onclick="this.getRootNode().host.signout();">Sign out</cc-button>
                </li>
              </ul>
            </cc-popover>
          </cc-popover-wrapper>
        `
            : `
          <cc-button href="/signin">Sign in</cc-button>
          <cc-button href="/signup" theme="primary">Sign up</cc-button>
        `
        }
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
