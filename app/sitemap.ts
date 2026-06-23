import type { MetadataRoute } from "next";

const BASE_URL = "https://www.vmpvilla.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/rooms", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/book", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/offers", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/facilities", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/location", priority: 0.8, changeFrequency: "yearly" as const },
    { url: "/reviews", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/story", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/agra-guide", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/cancellation", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
