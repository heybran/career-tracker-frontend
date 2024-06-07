import { makeToast } from "./makeToast.js";

/**
 * Renders the content of a page source into the specified outlet element.
 *
 * @param {string} pageSrc - The source of the page to render.
 * @param {HTMLElement} outlet - The element where the page content will be rendered.
 */
export const render = async (pageSrc, outlet) => {
  const {
    default: { tagName },
  } = await import(pageSrc);
  const page = document.createElement(tagName);
  outlet.replaceChildren(page);
};

export const toast = {
  success: (content, options = {}) => {
    return makeToast(content, "success", options);
  },
  error: (content, options = {}) => {
    return _toast(content, "error", options);
  },
};

/**
 * UtilsMixin can be used as a mixin for extending HTMLElement.
 *
 * @example
 * class EditJob extends UtilsMixin(HTMLElement) {
 *   static tagName = "edit-job";
 * }
 * EditJob.define();
 */
export function UtilsMixin(BaseElement) {
  return class extends BaseElement {
    /**
     * @example
     * <sp-menu-item value="pending" ${this.checked(job.status === "pending")}>Pending</sp-menu-item>
     */
    checked(value) {
      return !!value ? "checked" : "";
    }

    selected(value) {
      console.log(value);
      return `aria-selected=${!!value}`;
    }

    /**
     * Find the label element for an form field element.
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    getLabel(element) {
      const id = element.id;
      if (!id) return element;
      const label = element.parentElement.querySelector(`[for=${id}]`);
      return !!label ? label : element;
    }

    /**
     * Debounces a function, ensuring that it is only called after a certain delay
     * has passed since the last time it was invoked.
     *
     * @param {function} func - The function to be debounced.
     * @param {number} [delay=500] - The delay, in milliseconds, before the function
     * is invoked.
     * @return {function} - The debounced function.
     */
    debounce(func, delay = 500) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => func(), delay);
    }
  };
}
