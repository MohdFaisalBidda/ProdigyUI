"use client";

import SplitCards, { SplitCardsProps } from "./SplitCards";

const defaultCards: SplitCardsProps["cards"] = [
  {
    id: "card-1",
    frontImage: "/split1.png",
    backTitle: "Global Reach",
    backDescription: "Connect users, systems, and data across borders seamlessly.",
  },
  {
    id: "card-2",
    frontImage: "/split2.png",
    backTitle: "Intelligent Core",
    backDescription: "AI-powered decision making at the heart of everything.",
  },
  {
    id: "card-3",
    frontImage: "/split3.png",
    backTitle: "Rapid Expansion",
    backDescription: "Scale globally with speed, precision, and reliability.",
  },
];

export default function SplitCardsDemo(props?: Partial<SplitCardsProps>) {
  return (
    <SplitCards
      cards={props?.cards ?? defaultCards}
      introTitle={props?.introTitle}
      headerTitle={props?.headerTitle}
      outroTitle={props?.outroTitle}
      containerClassName={props?.containerClassName}
    />
  );
}
