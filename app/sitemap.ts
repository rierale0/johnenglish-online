import type { MetadataRoute } from "next";
import { getRedirectKeys } from "@/lib/redirects";

const siteUrl = "https://inglesconjohn.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/privacy",
    "/junior-fluency",
    ...getRedirectKeys().flatMap((key) => [`/${key}`, `/r/${key}`]),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
