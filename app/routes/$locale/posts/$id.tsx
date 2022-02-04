import { PrismicRichText } from "@prismicio/react";
import { LoaderFunction, useLoaderData } from "remix"
import { client, Post } from "~/utils/prismic";

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
	return await client.getByUID<Post>("post", params.id!, {
		lang: params.locale,
	});
}

export default function Post() {
	const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

	return <div>
		<PrismicRichText field={data.data.title} />
		<hr />
		<PrismicRichText field={data.data.content} />
	</div>;
}