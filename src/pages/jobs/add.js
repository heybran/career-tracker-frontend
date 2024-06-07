import { toast } from "utils/index.js";

export default class AddJob extends HTMLElement {
  static tagName = "add-job";

  addJob = (event) => {
    event.preventDefault();
    const form = event.target;
    // TODO: Convert this to be data like formData()
    const elements = Array.from(form.querySelectorAll("[name]")).reduce(
      (basket, elem) => {
        if (elem.name === "href") return basket;
        basket[elem.name] = elem.localName.includes("checkbox")
          ? !!elem.checked
          : elem.value;
        return basket;
      },
      {}
    );

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.pending = true;

    fetch(config.endpoint + "/jobs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(elements),
    })
      .then((res) => {
        // Handle the response from the server
        // ROUTER._routes.find((r) => r.path === "/jobs").expired = true;
        if (res.ok) {
          toast.success("Job added successfully");
          ROUTER.redirect("/jobs");
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
      <div class="content" part="content">
      <div>
        <h1>Add A New Job</h1>
        <p>Fill in this form to add a new job to the datbase.</p>
        </div>
        <form method="post" onsubmit="this.closest('${this.constructor.tagName}').addJob(event)">
          <cc-form-layout>
            <cc-text-field label="Website" required name="website"></cc-text-field>
            <cc-text-field label="Position" required name="position"></cc-text-field>
            <cc-text-field label="Source" name="source"></cc-text-field>
            <cc-date-picker label="Apply date" name="date_applied"></cc-date-picker>
            <cc-select name="status" label="Status">
              <cc-option value="pending">Pending</cc-option>
              <cc-option value="rejected">Rejected</cc-option>
              <cc-option value="not-applied">Not applied</cc-option>
            </cc-select>
            <cc-select name="apply_channel" label="Apply channel">
              <cc-option value="job_application_form">Jon Application Form</cc-option>
              <cc-option value="email">Email</cc-option>
              <cc-option value="linkedin">LinkedIn</cc-option>
            </cc-select>
            <div colspan="2">
              <p for="notes">Notes</p>
              <input id="notes" type="hidden" name="notes">
              <trix-editor input="notes" class="trix-content"></trix-editor>
            </div>
          </cc-form-layout>
          <cc-horizontal-layout>
            <cc-checkbox name="freelance">Freelance</cc-checkbox>
            <cc-checkbox name="volunteer_position">Volunteer Position</cc-checkbox>
            <cc-checkbox name="four_day_week">4 Day Week</cc-checkbox>
          </cc-horizontal-layout>
          <cc-button type="submit" theme="primary">Submit</cc-button>
        </form>
      </div>
    `;
  }
}

customElements.define(AddJob.tagName, AddJob);
