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
            <div>
              <sp-field-label for="website">Website</sp-field-label>
              <sp-textfield id="website" required name="website"></sp-textfield>
            </div>
            <div>
              <sp-field-label for="position">Position</sp-field-label>
              <sp-textfield id="position" required name="position"></sp-textfield>
            </div>
            <div>
              <sp-field-label for="source">Source</sp-field-label>
              <sp-textfield id="source" name="source"></sp-textfield>
            </div>
            <div>
              <sp-field-label for="date_applied">Apply Date</sp-field-label>
              <sp-textfield id="date_applied" name="date_applied"></sp-textfield>
            </div>
            <div>
              <sp-field-label for="status">Status</sp-field-label>
              <sp-combobox id="status" name="status">
                <sp-menu-item value="pending">Pending</sp-menu-item>
                <sp-menu-item value="rejected">Rejected</sp-menu-item>
                <sp-menu-item value="not-applied" checked>Not applied</sp-menu-item>
              </sp-combobox>
            </div>
            <div>
              <sp-field-label for="apply_channel">Apply Channel</sp-field-label>
              <sp-combobox id="apply_channel" name="apply_channel">
                <sp-menu-item value="job_application_form">Jon Application Form</sp-menu-item>
                <sp-menu-item value="email">Email</sp-menu-item>
                <sp-menu-item value="linkedin">LinkedIn</sp-menu-item>
              </sp-combobox>
            </div>
            <div colspan="2">
              <sp-field-label for="notes">Notes</sp-field-label>
              <input id="notes" type="hidden" name="notes">
              <trix-editor input="notes" class="trix-content"></trix-editor>
            </div>
          </cc-form-layout>
            <cc-horizontal-layout>
              <sp-checkbox name="freelance">Freelance</sp-checkbox>
              <sp-checkbox name="volunteer_position">Volunteer Position</sp-checkbox>
              <sp-checkbox name="four_day_week">4 Day Week</sp-checkbox>
            </cc-horizontal-layout>
            <sp-button size="m" type="submit">Submit</sp-button>
        </form>
      </div>
        
        `;
  }
}

customElements.define(AddJob.tagName, AddJob);
