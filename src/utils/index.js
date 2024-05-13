import { makeToast } from "./makeToast";

export const render = async (tagName, outlet) => {
  const page = document.createElement(tagName);
  outlet.replaceChildren(page);
};

export const toast = {
  success: (content, stayOnPage) => {
    return makeToast(content, "success", stayOnPage);
  },
  error: (content, stayOnPage) => {
    return _toast(content, "negative", stayOnPage);
  },
};

const _toast = (content, variant, stayOnPage = false) => {
  const toast = document.createElement("sp-toast");
  toast.open = true;
  toast.variant = variant;
  toast.innerHTML = content;
  if (!stayOnPage) {
    toast.timeout = 6000;
  }
  document.querySelector("[role=region]").appendChild(toast);
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
