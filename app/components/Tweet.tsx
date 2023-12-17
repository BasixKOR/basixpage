import { gql } from "~/utils/dato";
import {
  Tweet as TweetComponent,
  TwitterContextProvider,
} from "@basix-forks/react-static-tweets";
import { Suspense, useCallback } from "react";
import tweetCss from "@basix-forks/react-static-tweets/styles.css";

const fragment = gql`
	fragment Tweet on TweetRecord {
	}
`;

interface TweetProps {
  tweetId: string;
}

declare module "react" {
  interface HTMLAttributes<T extends HTMLTemplateElement> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    shadowroot?: "open" | "closed";
  }
}


export default function Tweet({ tweetId }: TweetProps) {
  const ref = useCallback((template: HTMLTemplateElement | null) => {
    if (!template) return;

    const mode: any = template.getAttribute("shadowroot");
    if (!template || mode == null) return;

    const shadowRoot = template.parentElement?.attachShadow({ mode });
    shadowRoot?.appendChild(template.content);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <template shadowroot="open" ref={ref}>
          <link rel="stylesheet" href={tweetCss} />
          <TwitterContextProvider
            value={{
              swrOptions: {
                suspense: true,
                revalidateIfStale: false,
                revalidateOnMount: false,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
              },
            }}
          >
            <TweetComponent id={tweetId} ast={null} />
          </TwitterContextProvider>
        </template>
      </div>
    </Suspense>
  );
}
