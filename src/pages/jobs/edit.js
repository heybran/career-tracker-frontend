import { UtilsMixin, toast } from "utils/index.js";

export default class EditJob extends UtilsMixin(HTMLElement) {
  static tagName = "edit-job";
  static define() {
    customElements.define(EditJob.tagName, EditJob);
  }

  updateJob = (event) => {
    event.preventDefault();
    const form = event.target;
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

    const invalidElement = Array.from(form.querySelectorAll("[name]")).find(
      (elem) =>
        !elem.valid &&
        elem.hasAttribute("required") &&
        !elem.hasAttribute("data-trix-input")
    );
    if (invalidElement) {
      return this.getLabel(invalidElement).scrollIntoView({ block: "start" });
    }

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.pending = true;
    const search = new URLSearchParams(location.search);
    const id = search.get("id");

    fetch(`${window.config.endpoint}/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: Number(id),
        ...elements,
      }),
    })
      .then((res) => {
        // Handle the response from the server
        if (res.ok) {
          toast.success("Job updated succesfully");
          ROUTER.redirect("/jobs", { expired: true });
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
      })
      .finally(() => {
        submitButton.pending = false;
      });
  };

  async connectedCallback() {
    // TODO: build this into router?
    const search = new URLSearchParams(location.search);
    let id = search.get("id");
    let job = window.config?.jobs?.find((job) => job.id === id);
    if (!job) {
      const res = await fetch(window.config.endpoint + `/jobs/${id}`, {
        credentials: "include",
      });
      job = await res.json();
    }
    console.log(job);
    this.innerHTML = `
    <div class="content" part="content">
        <div><h1>Edit job</h1>
        <p>You're currently editing job ${id}</p>
        </div>
        <form method="post" onsubmit="this.closest('${
          this.localName
        }').updateJob(event)">
            <cc-form-layout>
              <cc-text-field required name="website" label="Website" value="${
                job.website
              }"></cc-text-field>
              <cc-text-field label="Position" required name="position" value="${
                job.position
              }"></cc-text-field>
              <cc-text-field label="Source" name="source" value="${
                job.source
              }"></cc-text-field>
              <cc-date-picker label="Date applied" name="date_applied" value="${
                job.date_applied
              }"></cc-date-picker>
            
              <cc-select name="status" label="Status">
                <cc-option value="pending" ${this.selected(
                  job.status === "pending"
                )}>Pending</cc-option>
                <cc-option value="rejected" ${this.selected(
                  job.status === "rejected"
                )}>Rejected</cc-option>
                <cc-option value="not-applied" ${this.selected(
                  job.status === "not-applied"
                )}>Not applied</cc-option>
              </cc-select>

              <cc-select name="apply_channel" label="Apply channel">
                <cc-option value="job_application_form">Jon Application Form</cc-option>
                <cc-option value="email">Email</cc-option>
                <cc-option value="linkedin">LinkedIn</cc-option>
              </cc-select>

              <div colspan="2">
                <p for="notes">Notes</p>
                <input id="notes" type="hidden" name="notes" value="${
                  job.notes
                }">
                <trix-editor input="notes" class="trix-content"></trix-editor>
              </div>
            </cc-form-layout>

            <cc-horizontal-layout>
              <cc-checkbox name="freelance" ${this.checked(
                Number(job.freelance)
              )}>Freelance</cc-checkbox>
              <cc-checkbox name="volunteer_position" ${this.checked(
                Number(job.volunteer_position)
              )}>Volunteer Position</cc-checkbox>
              <cc-checkbox name="four_day_week" ${this.checked(
                Number(job.four_day_week)
              )}>4 Day Week</cc-checkbox>
            </cc-horizontal-layout>
            <cc-button type="submit" theme="primary">Submit</cc-button>
        </form>
    </div>`;
  }
}

EditJob.define();
