// @ts-check
import "cucumber-web-components/dist/side-nav";
import "cucumber-web-components/dist/side-nav-item";
import "cucumber-web-components/dist/icon";
import "cucumber-web-components/dist/form-layout";
import "cucumber-web-components/dist/text-field";
import "cucumber-web-components/dist/email-field";
import "cucumber-web-components/dist/date-picker";
import "cucumber-web-components/dist/option";
import "cucumber-web-components/dist/select";
import "cucumber-web-components/dist/textarea";
import "cucumber-web-components/dist/checkbox";
import "cucumber-web-components/dist/dialog";
import "cucumber-web-components/dist/button";
import "cucumber-web-components/dist/spinner";
import "cucumber-web-components/dist/password-field";
import "cucumber-web-components/dist/radio";
import "cucumber-web-components/dist/radio-group";
import "cucumber-web-components/dist/visually-hidden";
import "cucumber-web-components/dist/horizontal-layout";
import "cucumber-web-components/dist/badge";
import "cucumber-web-components/dist/popover-wrapper";
import "cucumber-web-components/dist/popover";
import "cucumber-web-components/dist/divider";
import JobController from "./job.js";
import User from "./src/user.js";
import CucumberRouter from "./src/router/index.js";
import { renderTable, renderFormElements } from "./dom.js";

(async () => {
  let endpoint = 'https://api.careertracker.work/api/v1';
  window.config = { endpoint };

  const res = await fetch(window.config.endpoint + '/users/is-logged-in', {
    credentials: 'include'
  });

  if (res.ok) {
    const { logged_in, user } = await res.json();
    if (logged_in) {
      window.config.user = user;
      import("./src/components/header.js");
    }
  }

  window.jobController = new JobController();
  window.user = new User();

  const outlet = document.querySelector('[router-outlet]');
  const ROUTER = new CucumberRouter(outlet, [
    {
      path: "/",
      redirect: window.config?.user && {
        path: '/jobs/add'
      }
    },
    {
      path: '/jobs',
      load: async ({ route, params }) => {
        const container = document.querySelector('tbody[render-target]');
        let jobs;

        if (ROUTER._previousRoute && ROUTER._previousRoute.path === route.path) {
          const res = await fetch(window.config.endpoint + `/jobs?${new URLSearchParams(location.search).toString()}`, {
            credentials: 'include',
          })
          jobs = await res.json();
          window.config.jobs = jobs;
        } else {
          if (window.config?.jobs && !route.expired) {
            jobs = window.config.jobs
          } else {
            const res = await fetch(window.config.endpoint + `/jobs?${new URLSearchParams(location.search).toString()}`, { credentials: 'include' });
            jobs = await res.json();
            window.config.jobs = jobs;
          }
        }
        
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
      },
      onExit: ({ route }) => {
        
      }
    },
    {
      path: '/jobs/add',
    },
    {
      path: '/jobs/edit',
      load: async ({ route, params, search }) => {
        let id = search.get("id");
        const form = document.forms['edit-job-form'];
        const layout = form.querySelector('cc-form-layout');
        const job = window.config.jobs.find(job => job.id === id);
        renderFormElements(job, layout);
        window.dispatchEvent(new CustomEvent('dataFetched'));
      }
    },
    {
      path: "/signin",
    },
    {
      path: "/signup",
    },
    {
      path: "/account/setting",
      load: async({ route, serach }) => {
        allow_password_login.checked = window.config.user.allowPasswordLogin;
        displayName.value = window.config.user.displayName;
      }
    },
    {
      path: "/activate-account",  
      load: async({ route, search }) => {
        fetch(`${config.endpoint}/users/${route.path.split('/').at(-1)}`, {
          method: 'POST',
          credentials: 'include',
          // If header is not set, php won't regonize the email/token is being passed
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: decodeURIComponent(search.get('email')),
            token: search.get('token'),
          })
        }).then((res) => {
          if (res.ok) {
            location.href = "/jobs/add";
          }
        }).catch(err => {
          console.error(err);
        })
      }
    },
    {
      path: "/login-via-email",
      load: async({ route, search }) => {
        fetch(`${config.endpoint}/users/${route.path.split('/').at(-1)}`, {
          method: 'POST',
          credentials: 'include',
          // If header is not set, php won't regonize the email/token is being passed
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: decodeURIComponent(search.get('email')),
            token: search.get('token'),
          })
        }).then((res) => {
          if (res.ok) {
            location.href = "/jobs/add";
          }
        }).catch(err => {
          console.error(err);
        })
      }
    }
  ]);

  window.ROUTER = ROUTER;
  ROUTER.start();
})();
