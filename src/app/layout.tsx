import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { IntroProvider } from "@/components/IntroProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { profile } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Google Analytics 4 measurement ID; <GoogleAnalytics> injects the gtag.js snippet.
const GA_ID = "G-GR70RCG708";

const title = "Arnav Gupta, AI and Full-Stack Engineer";
const description =
  "Arnav Gupta is an AI engineer and full-stack engineer at GetHelpDesk.ai. He builds LLM systems, RAG pipelines, backends and the products around them with Python, FastAPI, TypeScript and Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: title, template: "%s | Arnav Gupta" },
  description,
  applicationName: "Arnav Gupta",
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Arnav Gupta",
    "AI engineer",
    "full-stack engineer",
    "backend engineer",
    "LLM engineer",
    "RAG",
    "FastAPI",
    "Python",
    "Next.js",
    "TypeScript",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: { type: "website", locale: "en_US", url: "/", siteName: "Arnav Gupta", title, description },
  twitter: { card: "summary_large_image", title, description, creator: profile.xHandle, site: profile.xHandle },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: returning visitors (this session) and reduced-motion users
// skip the boot loader, so they never see it flash.
const bootScript = `try{if(sessionStorage.getItem("ag-booted")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.booted="1"}}catch(e){document.documentElement.dataset.booted="1"}`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.url}/#person`,
      name: profile.name,
      jobTitle: "AI Engineer and Full-Stack Engineer",
      worksFor: { "@type": "Organization", name: "GetHelpDesk.ai", url: "https://gethelpdesk.ai" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Thapar Institute of Engineering & Technology" },
      knowsAbout: ["Large language models", "Retrieval-augmented generation", "Python", "FastAPI", "TypeScript", "Next.js", "React Native"],
      url: profile.url,
      email: `mailto:${profile.email}`,
      telephone: profile.phone,
      sameAs: [profile.github, profile.linkedin, profile.x],
    },
    {
      "@type": "WebSite",
      "@id": `${profile.url}/#website`,
      url: profile.url,
      name: "Arnav Gupta",
      description,
      inLanguage: "en",
      author: { "@id": `${profile.url}/#person` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>
        <IntroProvider>{children}</IntroProvider>
        <CustomCursor />
        <Analytics />
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
