export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    document.body.classList.add('hidrated');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 1rem;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e6e6e6;
          position: fixed;
          left: 0;
          right: 0;
          background-color: #fff;
          z-index: 11;
        }
        a {
          text-decoration: none;
          color: inherit;
          width: 12em;
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
      </style>
      <header>
        <a href="/">
          <cc-visually-hidden>Visit Career Tracker Homepage</cc-visually-hidden>
          <img src="/career-tracker.svg" alt="Career Tracker Logo" role="img">
        </a>
        <cc-side-nav horizontal>
          <cc-side-nav-item path="/jobs/add">
            <cc-icon icon="plus-lg" slot="prefix"></cc-icon>
            Add a Job
          </cc-side-nav-item>
          <cc-side-nav-item path="/jobs">
            <cc-icon icon="table" slot="prefix"></cc-icon>
            Jobs
          </cc-side-nav-item>
          <style>
            cc-side-nav-item {
              --link-hover-color: var(--primary-color);
            }
          </style>
        </cc-side-nav>
        ${window.config.user ? `
          <cc-popover-wrapper>
            <cc-button slot="trigger">
              ${window.config.user.email}
              <cc-icon icon="chevron-down" slot="suffix"></cc-icon>
            </cc-button>
            <cc-popover placement="bottom-end">
              <ul>
                <li>
                  <cc-button style="width: 100%" href="/account/change-password">Update password</cc-button>
                </li>
                <li>
                  <cc-button style="width: 100%" onclick="window.user.signout(this)">Sign out</cc-button>
                </li>
              </ul>
            </cc-popover>
          </cc-popover-wrapper>
        ` : `
          <cc-button href="/signin">Sign in</cc-button>
          <cc-button href="/signup" theme="primary">Sign up</cc-button>
        `}
      </header>
    `; 
  }
}

customElements.define('cc-header', Header);
