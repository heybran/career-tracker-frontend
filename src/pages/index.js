import { UtilsMixin } from "utils/index.js";

export default class HomePage extends UtilsMixin(HTMLElement) {
  static tagName = "home-page";
  connectedCallback() {
    this.innerHTML = `
        <style>
            home-page {
                height: 80vh;
                height: 80dvh;
                display: grid;
                place-items: center;
            }
            home-page p {
                max-width: 60ch;
                margin-inline: auto;
            }
        </style>
        <div class="content" part="content">
            <h1 style="text-align: center;">
                <img src="/public/career-tracker.svg" alt="Career Tracker Logo" class="logo">
                <cc-visually-hidden>Career Tracker</cc-visually-hidden>
            </h1>
        <p>A tiny web app that helps you track the jobs you applied, built with vanilla JavaScript & Web Components on frontend and WordPress & PHP as backend.</p>
        <cc-horizontal-layout style="justify-content: center;">
            <cc-button href="/signup" theme="primary" style="width: 20rem;">Get started</cc-button>
        </cc-horizontal-layout>
        </div>
    `;
  }
}

customElements.define(HomePage.tagName, HomePage);
