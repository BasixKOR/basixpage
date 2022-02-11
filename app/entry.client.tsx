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

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
