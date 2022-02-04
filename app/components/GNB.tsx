import { PrismicLink } from "@prismicio/react";
import { Globe } from "react-feather";
import { Link } from "remix";
import type { GNB } from "~/utils/prismic";

interface GNBProps {
  data: GNB;
}

export default function GNB({ data }: GNBProps) {
  return (
    <nav className="container">
      <ul>
        <li>
          <Link to={`/${data.lang}`}>
            <strong>{data.data.title[0]?.text}</strong>
          </Link>
        </li>
      </ul>
      <ul>
        {data.data.menu_item.map((item) => (
          <li key={item.item_title}>
            <PrismicLink field={item.url}>{item.item_title}</PrismicLink>
          </li>
        ))}
        <li key="$lang">
          <Link to={data.lang === "ko-kr" ? "/en-gb" : "/ko-kr"}>
            <Globe />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
