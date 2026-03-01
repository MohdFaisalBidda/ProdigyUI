import React from "react";
import Cards, { CardsProps } from "./Cards";

export interface CardEntry extends CardsProps {
  id: string;
}

export interface StrokeCardsProps {
  /** Array of card data */
  cards?: CardEntry[];
  /** Number of cards per row */
  columns?: 2 | 3 | 4;
  /** Gap between cards */
  gap?: string;
  /** Padding around the grid */
  padding?: string;
}

const DEFAULT_CARDS: CardEntry[] = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems" },
  { id: "4", imgSrc: "/img4.avif", title: "Layout Grid" },
  { id: "5", imgSrc: "/img5.avif", title: "Interaction" },
  { id: "6", imgSrc: "/img6.avif", title: "Animation" },
];

function StrokeCards({
  cards = DEFAULT_CARDS,
  columns = 2,
  gap = "1rem",
  padding = "0 2rem",
}: StrokeCardsProps) {
  const rows: CardEntry[][] = [];
  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }

  return (
    <div style={{ padding }}>
      <div
        className="w-full flex flex-col justify-center items-center"
        style={{ gap }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="w-full flex flex-col md:flex-row justify-center items-center"
            style={{ gap }}
          >
            {row.map((card) => (
              <Cards key={card.id} {...card} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrokeCards;