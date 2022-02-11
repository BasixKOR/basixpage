import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

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

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
