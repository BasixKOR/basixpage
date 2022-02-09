import { gql } from "~/utils/dato";
import {
  Tweet as TweetComponent,
  TwitterContextProvider,
} from "@basix-forks/react-static-tweets";
import { Suspense } from "react";

const fragment = gql`
	fragment Tweet on TweetRecord {
	}
`;

interface TweetProps {
  tweetId: string;
}

export default function Tweet({ tweetId }: TweetProps) {
  return (
    <Suspense fallback="loading...">
      <TwitterContextProvider value={{ swrOptions: { suspense: true } }}>
        <TweetComponent id={tweetId} />
      </TwitterContextProvider>
    </Suspense>
  );
}
