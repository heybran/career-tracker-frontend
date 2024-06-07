import "ccw/side-nav/index.js";
import "ccw/side-nav-item/index.js";
import "ccw/icon/index.js";
import "ccw/form-layout/index.js";
import "ccw/text-field/index.js";
import "ccw/email-field/index.js";
import "ccw/date-picker/index.js";
import "ccw/option/index.js";
import "ccw/select/index.js";
import "ccw/textarea/index.js";
import "ccw/checkbox/index.js";
import "ccw/dialog/index.js";
import "ccw/button/index.js";
import "ccw/spinner/index.js";
import "ccw/password-field/index.js";
import "ccw/radio/index.js";
import "ccw/radio-group/index.js";
import "ccw/visually-hidden/index.js";
import "ccw/horizontal-layout/index.js";
import "ccw/badge/index.js";
import "ccw/popover-wrapper/index.js";
import "ccw/popover/index.js";
import "ccw/divider/index.js";
import "ccw/search-field/index.js";

import BreezeRouter from "breeze-router";
import { render } from "utils/index.js";
window.ROUTER = new BreezeRouter();

(async () => {
  const endpoint = ["127.0.0.1", "localhost"].includes(window.location.hostname)
    ? "http://localhost/api/v1"
    : "https://api.careertracker.work/api/v1";
  // What about adding config to router?
  window.config = { endpoint };

  const res = await fetch(window.config.endpoint + "/users/is-logged-in", {
    credentials: "include",
  });

  if (res.ok) {
    const { logged_in, user } = await res.json();
    if (logged_in) {
      window.config.user = user;
      import("/src/components/header.js");
    }
  }

  /** @type {HTMLElement | null} */
  const outlet = document.querySelector("#app");

  ROUTER.add("/", async ({ route, params }) => {
    if (window.config.user) {
      return ROUTER.redirect("/jobs");
    }

    render("pages/index.js", outlet);
  });

  ROUTER.add("/signup", async ({ route, params }) => {
    render("pages/signup/index.js", outlet);
  });

  ROUTER.add("/signin", async ({ route, params }) => {
    render("pages/signin/index.js", outlet);
  });

  ROUTER.add("/login-via-email", async ({ route, params }) => {
    const search = new URLSearchParams(location.search);
    fetch(`${window.config.endpoint}/users/${route.path.split("/").at(-1)}`, {
      method: "POST",
      credentials: "include",
      // If header is not set, php won't regonize the email/token is being passed
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decodeURIComponent(search.get("email")),
        token: search.get("token"),
      }),
    })
      .then((res) => {
        if (res.ok) {
          location.href = "/jobs/add";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  ROUTER.add("/activate-account", async ({ route, params }) => {
    const search = new URLSearchParams(location.search);
    fetch(`${window.config.endpoint}/users/${route.path.split("/").at(-1)}`, {
      method: "POST",
      credentials: "include",
      // If header is not set, php won't regonize the email/token is being passed
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decodeURIComponent(search.get("email")),
        token: search.get("token"),
      }),
    })
      .then((res) => {
        if (res.ok) {
          location.href = "/jobs/add";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  ROUTER.add("/jobs/add", async ({ route, params }) => {
    console.log(1);
    render("pages/jobs/add.js", outlet);
  });

  ROUTER.add("/jobs", async ({ route, params }) => {
    if (ROUTER._previousRoute.path === route.path) {
      return outlet?.firstElementChild?.refresh();
    }
    render("pages/jobs/index.js", outlet);
  });

  ROUTER.add("/jobs/edit", async ({ route, params }) => {
    render("pages/jobs/edit.js", outlet);
  });

  ROUTER.start();
})();
