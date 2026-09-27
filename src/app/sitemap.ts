import type { MetadataRoute } from "next";
import { profile } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${profile.url}${profile.resume}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
