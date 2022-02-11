import { hydrateRoot } from "react-dom";
import { RemixBrowser } from "remix";

// Remove Apollo Devtool hooks.
document
  .querySelectorAll("html>script[type=module]")
  .forEach((v) => v.remove());

// global polyfill.
window.global = window;

// Workaorund React bug.
HTMLTemplateElement.prototype.appendChild = function (child) {
  return this.content.appendChild(child);
}

HTMLTemplateElement.prototype.removeChild = function (child) {
  return this.content.removeChild(child);
}

Object.defineProperty(HTMLTemplateElement.prototype, "firstChild", {
  get() {
    return this.content.firstChild;
  }
})

hydrateRoot(document, <RemixBrowser />);
