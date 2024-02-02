export default class Footer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: 1rem;
        }
        a {
          color: inherit;
        }
        p {
          padding-block: 0.5rem;
        }
      </style>
      <footer>
        Crafted by <a href="https://github.com/heybran">@heybran.</a>
        Logo icon is downloaded from <a href="https://icons8.com/">Icons8</a>.
      </footer>
    `; 
  }
}

customElements.define('cc-footer', Footer);