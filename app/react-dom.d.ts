import { ReactElement } from "react";

interface RenderToPipeableStreamOptions {
  identifierPrefix?: string;
  namespaceURI?: string;
  nonce?: string;
  bootstrapScriptContent?: string;
  bootstrapScripts?: Array<string>;
  bootstrapModules?: Array<string>;
  progressiveChunkSize?: number;
  onShellReady?: () => void;
  onShellError?: () => void;
  onAllReady?: () => void;
  onError?: (error: any) => void;
}

interface RenderToPipeableStreamReturn {
  pipe(writable: NodeJS.WritableStream): void;
  abort(): void;
}

declare module "react-dom/server" {
  export function renderToPipeableStream(
    element: ReactElement,
    options: RenderToPipeableStreamOptions
  ): RenderToPipeableStreamReturn;
}
