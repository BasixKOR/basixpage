import invariant from "tiny-invariant";
import { ImageFragment } from "~/graphql/generated";
import { gql } from "@urql/core";

export const fragment = gql`
  fragment Image on ImageRecord {
    __typename
    id
    image {
      responsiveImage {
        srcSet
        sizes
      }
      alt
      url
    }
  }
`;

interface ImageProps {
	data: ImageFragment;
}

export default function Image({ data }: ImageProps) {
	invariant(data.image, "Image data is missing");

	return (
		<img
			src={data.image.url}
			sizes={data.image.responsiveImage?.sizes}
			alt={data.image.alt ?? undefined}
			srcSet={data.image.responsiveImage?.srcSet}
		/>
	);
}
