import { MetadataRoute } from "next";
import { components } from "@/data/componentData";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://prodigy-ui.in/sitemap.xml",
  };
}
