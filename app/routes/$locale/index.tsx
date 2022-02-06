import { LoaderFunction, redirect, useLoaderData } from "remix";

export const loader: LoaderFunction = ({ params }) => {
  return redirect('posts');
};

// export default function Index() {
// 	const data = useLoaderData<Home>();

//   return (
//     <div className="container">
//       <article>
// 				<header>
// 					<PrismicRichText field={data.data.title} />
// 				</header>
// 				<PrismicRichText field={data.data.content} />
//       </article>
//     </div>
//   );
// }
