// @ts-check
import {
  isFunction,
  isAsyncFunction,
  removeTrailingSlash,
  findAnchor,
  shouldRouterHandleClick,
} from "./utils.js";

/**
 * Class representing a router.
 */
export default class CucumberRouter {
  /**
   * Creates a new BreezeRouter instance.
   * @constructor
   * @param {HTMLElement} outlet - outlet to render template content that match current url
   */
  constructor(outlet, routes) {
    this.outlet = outlet;
    this._routes = routes;

    /**
     * The previous route that was navigated to
     * @type {import('./types.js').Route}
     * @private
     */
    this._previousRoute = {};

    this._currentRoute = {};

    this._routesVisited = [];

    // Bind event listeners
    window.addEventListener("popstate", this._onChanged.bind(this));
    document.body.addEventListener("click", this._handleClick.bind(this));
  }

  /**
   * Starts the router.
   * @returns {void}
   */
  start() {
    this._onChanged();
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url - The URL to navigate to
   * @returns {void}
   */
  navigateTo(url) {
    if (url.endsWith('?')) {
      url = url.replace('?', '');
    }
    window.history.pushState({ url }, "", url);
    this._onChanged();
  }

  /**
   * Redirects a URL
   * @param {string} url
   * @returns {void}
   */
  redirect(url, options = {}) {
    const { expired } = options;
    if (expired) {
      this._routes.find(route => route.path === url).expired = true;
    }
    this.navigateTo(url);
  }

  async _onChanged() {
    this._previousRoute = this._currentRoute;
    const path = window.location.pathname;
    const { route, params, search } = this._matchUrlToRoute(path);

    // console.log({ route, params });
    // If no matching route found, route will be '404' route
    // which has been handled by _matchUrlToRoute already
    // await this._handleRoute({ route, params });

    
    // Render template content into router outlet
    const template = document.querySelector(`[path="${route.path}`);

    // if (template.hasAttribute('protected-route') && this._protectedRouteGuard) {
    //   const valid = await this._protectedRouteGuard.authCheck();
    //   if (!valid) {
    //     if (template.hasAttribute('redirect')) {
    //       return this.redirect(template.getAttribute('redirect'));
    //     }
    //     return this._protectedRouteGuard.callback();
    //   }
    // }

    if (route.redirect?.path) {
      return this.redirect(route.redirect.path);
    }

    
    const spinnerID = this.outlet.getAttribute('router-spinner');
    // @TODO: spinner need to be first element child of this template,
    // as content.cloneNode(true) is #document-fragment, not general DOM node
    const spinner = document.querySelector(`template#${spinnerID}`).content.firstElementChild.cloneNode(true);
    document.body.appendChild(spinner);

    if (this._previousRoute && this._previousRoute.onExit) {
      this._previousRoute.onExit({ route, params, search });
    }

    this._currentRoute = route;
    this._routesVisited.push(this._currentRoute);
    if (this._currentRoute?.path !== this._previousRoute?.path) {
      this.outlet.innerHTML = '';
      this.outlet.replaceChildren(template.content.cloneNode(true));
    }
    
    if (isFunction(route.load)) {
      route.load({ route, params, search });
    } else if (isAsyncFunction(route.load)) {
      await route.load({ route, params, search });
    }

    if (template.hasAttribute('async-render')) {
      const tempContainer = document.createElement('div');
      tempContainer.style.opacity = '0';
      tempContainer.appendChild(template.content.cloneNode(true));
      this.outlet.replaceChildren(tempContainer);
      window.addEventListener('dataFetched', () => {
        this.outlet.replaceChildren(...tempContainer.children);
        spinner.remove();
      }, { once: true });
    } else {
      
      spinner.remove();
    }
  }

  /**
   * Processes route callbacks registered by app
   * @param {import('./types.js').MatchedRoute} options
   * @returns {Promise<void>}
   */
  async _handleRoute({ route, params }) {
    if (isFunction(route.handler)) {
      route.handler({ route, params });
    }

    if (isAsyncFunction(route.handler)) {
      await route.handler({ route, params });
    }
  }

  /**
   *
   * @param {string} url - Current url users visite or nagivate to.
   * @returns {import('./types.js').MatchedRoute}
   */
  _matchUrlToRoute(url) {
    /** @type {import('./types.js').RouteParams} */
    const params = {};

    if (url !== "/") {
      url = removeTrailingSlash(url);
    }

    const matchedRoute = this._routes.find((route) => {
      if (url.split("/").length !== route.path.split("/").length) {
        return false;
      }

      let routeSegments = route.path.split("/").slice(1);
      let urlSegments = url.split("/").slice(1);

      // If each segment in the url matches the corresponding segment in the route path,
      // or the route path segment starts with a ':' then the route is matched.
      const match = routeSegments.every((segment, i) => {
        return segment === urlSegments[i] || segment.startsWith(":");
      });

      if (!match) {
        return false;
      }

      // If the route matches the URL, pull out any params from the URL.
      routeSegments.forEach((segment, i) => {
        if (segment.startsWith(":")) {
          const propName = segment.slice(1);
          params[propName] = decodeURIComponent(urlSegments[i]);
        }
      });

      return true;
    });

    const search = new URLSearchParams(location.search);

    if (matchedRoute) {
      return { route: matchedRoute, params, search };
    } else {
      return { route: this._routes[404], params, search };
    }
  }

  /**
   * Handles <a> link clicks
   * @param {Event} event
   * @returns {void}
   */
  _handleClick(event) {
    const anchor = findAnchor(event);
    if (!anchor) {
      return;
    }

    if (!shouldRouterHandleClick(event, anchor)) {
      return;
    }

    event.preventDefault();
    let href = anchor.getAttribute("href").trim();
    if (!href.startsWith("/")) {
      href = "/" + href;
    }

    this.navigateTo(href);
  }

  /**
   * Add or remove search param to current url.
   * @param {HTMLInputElement} checkbox 
   * @param {string} value
   * @returns void
   */
  toggleParam(checkbox, value) {
    const params = new URLSearchParams(location.search);
    const name = checkbox.getAttribute('name')
    if (checkbox.reflectTarget.checked) {
      !params.has(name) && params.set(name, value);
    } else if (!checkbox.reflectTarget.checked) {
      params.has(name) && params.delete(name);
    }
    
    /**
     * Need to update router to only update page when params changes,
     * while pathname is not changed.
     */
    this.navigateTo(`${location.pathname}?${params.toString()}`);
  }
}
