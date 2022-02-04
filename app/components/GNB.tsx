import { PrismicLink } from "@prismicio/react";
import type { GNB } from "~/utils/prismic";

interface GNBProps {
  data: GNB;
}

export default function GNB({ data }: GNBProps) {
  return (
    <nav className="container">
      <ul>
        <li>
          <strong>{data.data.title[0]?.text}</strong>
        </li>
      </ul>
      <ul>
        {data.data.menu_item.map((item) => (
          <li>
            <PrismicLink field={item.url}>{item.item_title}</PrismicLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
