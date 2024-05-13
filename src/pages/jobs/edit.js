import { UtilsMixin, toast } from "../../utils";

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
    this.innerHTML = `
    <div class="content" part="content">
        <div><h1>Edit job</h1>
        <p>You're currently editing job ${id}</p>
        </div>
        <form method="post" onsubmit="this.closest('${
          this.localName
        }').updateJob(event)">
            <cc-form-layout>
            <div>
                <sp-field-label for="website">Website</sp-field-label>
                <sp-textfield id="website" required name="website" value="${
                  job.website
                }"></sp-textfield>
            </div>
            <div>
                <sp-field-label for="position">Position</sp-field-label>
                <sp-textfield id="position" required name="position" value="${
                  job.position
                }"></sp-textfield>
            </div>
            <div>
                <sp-field-label for="source">Source</sp-field-label>
                <sp-textfield id="source" name="source" value="${
                  job.source
                }"></sp-textfield>
            </div>
            <div>
                <sp-field-label for="date_applied">Date Applied</sp-field-label>
                <sp-textfield id="date_applied" name="date_applied" value="${
                  job.date_applied
                }"></sp-textfield>
            </div>
            <div>
                <sp-field-label for="status">Status</sp-field-label>
                <sp-combobox id="status" name="status" value="${job.status}">
                <sp-menu-item value="pending">Pending</sp-menu-item>
                <sp-menu-item value="rejected">Rejected</sp-menu-item>
                <sp-menu-item value="not-applied" checked>Not applied</sp-menu-item>
                </sp-combobox>
            </div>
            <div>
                <sp-field-label for="apply_channel">Apply Channel</sp-field-label>
                <sp-combobox id="apply_channel" name="apply_channel" value="${
                  job.apply_channel
                }">
                <sp-menu-item value="job_application_form">Jon Application Form</sp-menu-item>
                <sp-menu-item value="email">Email</sp-menu-item>
                <sp-menu-item value="linkedin">LinkedIn</sp-menu-item>
                </sp-combobox>
            </div>
            <div colspan="2">
                <sp-field-label for="notes">Notes</sp-field-label>
                <input id="notes" type="hidden" name="notes" value="${
                  job.notes
                }">
                <trix-editor input="notes" class="trix-content"></trix-editor>
            </div>
            </cc-form-layout>
            <cc-horizontal-layout>
                <sp-checkbox name="freelance" ${this.checked(
                  Number(job.freelance)
                )}>Freelance</sp-checkbox>
                <sp-checkbox name="volunteer_position" ${this.checked(
                  Number(job.volunteer_position)
                )}>Volunteer Position</sp-checkbox>
                <sp-checkbox name="four_day_week" ${this.checked(
                  Number(job.four_day_week)
                )}>4 Day Week</sp-checkbox>
            </cc-horizontal-layout>
            <sp-button size="m" type="submit">Submit</sp-button>
        </form>
    </div>`;
  }
}

EditJob.define();
