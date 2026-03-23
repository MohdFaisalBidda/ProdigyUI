import { MetadataRoute } from "next";
import { components } from "@/data/componentData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://prodigy-ui.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/components`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = components.map((component) => ({
    url: `${baseUrl}/components/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...componentRoutes];
}
