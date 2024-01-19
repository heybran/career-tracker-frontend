import "./style.css";
let endpoint = 'https://api.careertracker.work/api/v1';
window.config = { endpoint };

const res = await fetch(window.config.endpoint + '/users/is-logged-in', {
  credentials: 'include'
});

if (res.ok) {
  const { logged_in, user } = await res.json();
  if (logged_in) {
    window.config.user = user;
  }
}

import "./src/components/header.js";
import "./src/components/footer.js";
import "cucumber-components/dist/components/side-nav/side-nav.js";
import "cucumber-components/dist/components/side-nav-item/side-nav-item.js";
import "cucumber-components/dist/components/icon/icon.js";
import "cucumber-components/dist/components/form-layout/form-layout.js";
import "cucumber-components/dist/components/text-field/text-field.js";
import "cucumber-components/dist/components/email-field/email-field.js";
import "cucumber-components/dist/components/date-picker/date-picker.js";
import "cucumber-components/dist/components/option/option.js";
import "cucumber-components/dist/components/select/select.js";
import "cucumber-components/dist/components/textarea/textarea.js";
import "cucumber-components/dist/components/checkbox/checkbox.js";
import "cucumber-components/dist/components/dialog/dialog.js";
import "cucumber-components/dist/components/button/button.js";
import "cucumber-components/dist/components/spinner/spinner.js";
import "cucumber-components/dist/components/password-field/password-field.js";
import "cucumber-components/dist/components/radio/radio.js";
import "cucumber-components/dist/components/radio-group/radio-group.js";
import "cucumber-components/dist/components/visually-hidden/visually-hidden.js";
import "cucumber-components/dist/components/horizontal-layout/horizontal-layout.js";
import "cucumber-components/dist/components/badge/badge.js";
import "cucumber-components/dist/components/popover-wrapper/popover-wrapper.js";
import "cucumber-components/dist/components/popover/popover.js";
import JobController from "./job.js";
import User from "./src/user.js";
import CucumberRouter from "./src/router/index.js";
import { renderTable, renderFormElements } from "./dom.js";

window.jobController = new JobController();
window.user = new User();

const outlet = document.querySelector('[router-outlet]');
const ROUTER = new CucumberRouter(outlet, [
  {
    path: "/",
    template: document.querySelector('[path="/"]'),
    redirect: window.config.user && {
      path: '/jobs/add'
    }
  },
  {
    path: '/jobs',
    template: document.querySelector('[path="/jobs"]'),
    load: async ({ route, params }) => {
      fetch(window.config.endpoint + '/jobs', {
        credentials: 'include'
      }).then((res) => res.json()).then((jobs) => {
        const container = document.querySelector('tbody[render-target]');
        if (jobs.length) {
          container.innerHTML = renderTable(jobs);
        } else {
          const t = document.createElement('template');
          t.innerHTML = `
            <h1>No jobs added yet.</h1>
            <cc-button theme="primary" href="/jobs/add">Add a job</cc-button>
          `;
          container?.closest('table')?.replaceWith(t.content.cloneNode(true));
        }
        window.dispatchEvent(new CustomEvent('dataFetched'));
      });
    }
  },
  {
    path: '/jobs/add',
    template: document.querySelector('[path="/jobs/add"]'),
  },
  {
    path: '/jobs/edit',
    template: document.querySelector('[path="/jobs/edit"]'),
    load: async ({ route, params, search }) => {
      let id = search.get("id");
      const form = document.forms['edit-job-form'];
      const layout = form.querySelector('cc-form-layout');
      fetch(`${config.endpoint}/jobs/${id}`, {
        credentials: 'include'
      }).then(res => res.json()).then(job => {
        renderFormElements(job, layout);
        window.dispatchEvent(new CustomEvent('dataFetched'));
      });
    }
  },
  {
    path: "/signin",
    template: document.querySelector('[path="/signin"]'),
  },
  {
    path: "/signup",
    template: document.querySelector('[path="/signup"]'),
  },
  {
    path: "/account/change-password",
    template: document.querySelector('[path="/account/change-password"]'),
  }
]);

// ROUTER.addProtectedRouteGuard(async () => {
//   /**
//    * By default, when making a fetch request from the client-side JavaScript code, 
//    * cookies are not automatically sent along with the request. 
//    * However, you can include the `credentials` option with the value `'include'` 
//    * to ensure that cookies are sent along with the request.
//    */
//   const res = await fetch(window.config.endpoint + '/get-cookie', {
//     credentials: 'include'
//   });
//   if (res.ok) {
//     window.isUserLoggedin = true;
//     // return true;
//   }
//   // return false;
//   // const data = await res.json();
//   // return data.isLoggedin;
// }, () => {
//   const template = document.createElement('template');
//   template.innerHTML = `
//     <cc-dialog label="You need to signin">
//       Click ok will redirect you to home page to signin.
//       <cc-button 
//         theme="primary" 
//         onclick="this.parentElement.close();"
//         href="/signin"
//         slot="footer-actions-right"
//         style="width: 5em;"
//       >Ok</cc-button>
//     </cc-dialog>
//   `;
//   const dialog = template.content.cloneNode(true);
//   document.body.appendChild(dialog);
//   document.body.lastElementChild.show();
// });
window.ROUTER = ROUTER;

ROUTER.start();
