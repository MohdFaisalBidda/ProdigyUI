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
  /** Minimum card width */
  minCardWidth?: string;
  /** Maximum card width */
  maxCardWidth?: string;
}

const DEFAULT_CARDS: CardEntry[] = [
  { id: "1", title: "Motion Design" },
  { id: "2", title: "Typography" },
  { id: "3", title: "Color Systems" },
  { id: "4", title: "Layout Grid" },
  { id: "5", title: "Interaction" },
  { id: "6", title: "Animation" },
];

function StrokeCards({
  cards = DEFAULT_CARDS,
  columns = 2,
  gap = "1rem",
  padding = "0 2rem",
  minCardWidth = "280px",
  maxCardWidth = "400px",
}: StrokeCardsProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

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
              <div
                key={card.id}
                style={{ minWidth: minCardWidth, maxWidth: maxCardWidth }}
                className="w-full"
              >
                <Cards {...card} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrokeCards;