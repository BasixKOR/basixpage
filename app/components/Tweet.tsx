import { gql } from "~/utils/dato";
import {
  Tweet as TweetComponent,
  TwitterContextProvider,
} from "@basix-forks/react-static-tweets";
import { Suspense } from "react";
import root from "react-shadow";
import tweetCss from "@basix-forks/react-static-tweets/styles.css";

const fragment = gql`
	fragment Tweet on TweetRecord {
	}
`;

interface TweetProps {
  tweetId: string;
}

export default function Tweet({ tweetId }: TweetProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <root.div>
        <link rel="stylesheet" href={tweetCss} />
        <TwitterContextProvider value={{ swrOptions: { suspense: true } }}>
          <TweetComponent id={tweetId} />
        </TwitterContextProvider>
      </root.div>
    </Suspense>
  );
}
