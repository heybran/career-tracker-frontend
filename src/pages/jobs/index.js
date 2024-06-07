import { UtilsMixin, toast } from "utils/index.js";

export default class JobsList extends UtilsMixin(HTMLElement) {
  static tagName = "jobs-list";

  getJobs = async () => {
    const res = await fetch(
      window.config.endpoint +
        `/jobs?${new URLSearchParams(location.search).toString()}`,
      {
        credentials: "include",
      }
    );
    return await res.json();
  };

  async connectedCallback() {
    const jobs = await this.getJobs();
    this.innerHTML = `
        <div class="content" part="content">
        <section class="table_filter">
          <cc-horizontal-layout>
            <cc-checkbox 
              name="freelance" 
              label="Freelance" 
              onchange="window.ROUTER.toggleParam(this, 1)"
              ${this.checked(
                new URLSearchParams(location.search).get("freelance") == 1
              )}
            >
              Freelance
            </cc-checkbox>
            <cc-checkbox 
              name="four_day_week" 
              label="4 day week" 
              onchange="window.ROUTER.toggleParam(this, 1)"
              ${this.checked(
                new URLSearchParams(location.search).get("four_day_week") == 1
              )}
            >
              4 Day Week
            </cc-checkbox>
            <cc-checkbox 
              name="volunteer_position" 
              label="Volunteer position" 
              onchange="window.ROUTER.toggleParam(this, 1)"
              ${this.checked(
                new URLSearchParams(location.search).get(
                  "volunteer_position"
                ) == 1
              )}
            >
              Volunteer Position
            </cc-checkbox>
            <form onsubmit="this.closest('${
              this.localName
            }').searchJob(event)" role="search">
              <cc-search-field name="q" placeholder="Search">
                <cc-button slot="suffix" theme="square borderless" type="submit">
                  <cc-icon label="Submit Search" icon="search"></cc-icon>
                </cc-button>
              </cc-search-field>
            </form>
          </cc-horizontal-layout>
        </section>
        <table>
          <thead>
            <tr>
              <th>Website</th>
              <th>Position</th>
              <th>Source</th>
              <th>Date Applied</th>
              <th>Apply Channel</th>
              <th>Status</th>
              <th>Volunteer Position</th>
              <th>Freelance</th>
              <th>4 <br>Day<br> Week</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderTable(jobs)}
          </tbody>
        </table>
      </article>
      <cc-dialog label="Delete Job" id="delete-job-dialog">
      </cc-dialog>
      </div>
    `;
  }

  renderTable = (jobs, container) => {
    let html = "";
    jobs.forEach((job) => {
      html += `
        <tr data-job-id="${job.id}">
          <td>${decodeURIComponent(job.website)}</td>
          <td>${job.position}</td>
          <td>${job.source ?? ""}</td>
          <td>${job.date_applied}</td>
          <td>${job.apply_channel}</td>
          <td><cc-badge theme="primary">${job.status}</cc-badge></td>
          <td>${
            Number(job.volunteer_position) !== 0
              ? `<cc-badge theme="success">Yes</cc-badge>`
              : '<cc-badge theme="neutral">No</cc-badge>'
          }</td>
          <td>${
            job.freelance && Number(job.freelance) !== 0
              ? `<cc-badge theme="success">Yes</cc-badge>`
              : '<cc-badge theme="neutral">No</cc-badge>'
          }</td>
          <td>${
            Number(job.four_day_week) !== 0
              ? `<cc-badge theme="success">Yes</cc-badge>`
              : '<cc-badge theme="neutral">No</cc-badge>'
          }</td>
          <td>${job.notes}</td>
          <td>            
            <cc-popover-wrapper>
              <cc-button theme="borderless round" slot="trigger">
                <cc-icon icon="three-dots"></cc-icon>
                <cc-visually-hidden>More actions</cc-visually-hidden>
              </cc-button>
              <cc-popover placement="bottom-end">
                <style>
                </style>
                <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; width: 15rem;">
                  <cc-button theme="primary" href="/jobs/edit?id=${job.id}">
                    <cc-icon icon="pencil-square" slot="prefix"></cc-icon>
                    Edit
                  </cc-button>
                  <cc-button theme="danger" onclick="this.closest('${
                    this.localName
                  }').showDeleteDialog('${job.id}', '${job.website}')">
                    <cc-icon icon="trash" slot="prefix"></cc-icon>
                    Delete
                  </cc-button>
                </div>
              </cc-popover>
            </cc-popover-wrapper>   
          </td>
        </tr>
      `;
    });

    if (container) {
      container.innerHTML = html;
    }

    return html;
  };

  refresh = async () => {
    const jobs = await this.getJobs();
    this.renderTable(jobs, this.querySelector("tbody"));
  };

  showDeleteDialog = (id, website) => {
    const dialog = document.querySelector("#delete-job-dialog");
    dialog.innerHTML = `
      <p>Are you sure you want to delete job from <b>${website}?</b></p>
      <cc-button theme="secondary" onclick="this.parentElement.close();" slot="footer-actions-left">Cancel</cc-button>
      <cc-button theme="primary" onclick="this.closest('${this.localName}').deleteJob('${id}', this);" slot="footer-actions-right">Confirm</cc-button>
    `;
    dialog.show();
  };

  deleteJob = (id, trigger) => {
    trigger.pending = true;
    fetch(`${window.config.endpoint}/jobs/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          trigger.closest("cc-dialog").close();
          ROUTER.redirect("/jobs");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        trigger.pending = false;
        toast.success("Job deleted successfully!");
      });
  };

  searchJob = async (event) => {
    event.preventDefault();
    const res = await fetch(
      window.config.endpoint +
        `/jobs?${new URLSearchParams(location.search).toString()}&q=${
          event.target.value
        }`,
      {
        credentials: "include",
      }
    );
    const jobs = await res.json();
    this.renderTable(jobs, this.querySelector("tbody"));
  };

  updateSearchParam = (event) => {
    this.debounce(() => console.log(event));
  };
}

customElements.define(JobsList.tagName, JobsList);
