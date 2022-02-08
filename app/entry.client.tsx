import { hydrateRoot } from "react-dom";
import { RemixBrowser } from "remix";

// Remove Apollo Devtool hooks.
document.querySelectorAll("html>script[type=module]").forEach(v => v.remove());

hydrateRoot(document, <RemixBrowser />);
