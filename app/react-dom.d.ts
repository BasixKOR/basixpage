import { ReactElement } from "react";

interface RenderToPipeableStreamOptions {
	bootstrapScripts?: string[];
	onCompleteShell?(): void;
	onCompleteAll?(): void;
	onError?(e: Error): void;
}

interface RenderToPipeableStreamReturn {
	pipe(writable: NodeJS.WritableStream): void;
	abort(): void;
}

declare module 'react-dom/server' {
	export function renderToPipeableStream(element: ReactElement, options: RenderToPipeableStreamOptions): RenderToPipeableStreamReturn;
}

declare module "react" {
  interface HTMLAttributes<T extends HTMLTemplateElement> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    shadowroot?: "open" | "closed";
  }
}
