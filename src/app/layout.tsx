import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IntroProvider } from "@/components/IntroProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { profile } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Arnav Gupta is an AI engineer and full-stack engineer at GetHelpDesk.ai. He builds LLM systems, RAG pipelines, backends and the products around them with Python, FastAPI, TypeScript and Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: "Arnav Gupta, AI and Full-Stack Engineer", template: "%s | Arnav Gupta" },
  description,
  authors: [{ name: profile.name, url: profile.url }],
  keywords: ["Arnav Gupta", "AI engineer", "full-stack engineer", "backend engineer", "LLM", "RAG", "FastAPI", "Next.js", "TypeScript", "portfolio"],
  openGraph: { title: "Arnav Gupta, AI and Full-Stack Engineer", description, url: profile.url, siteName: "Arnav Gupta", type: "website" },
  twitter: { card: "summary_large_image", title: "Arnav Gupta, AI and Full-Stack Engineer", description },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

// Runs before first paint: returning visitors (this session) and reduced-motion users
// skip the boot loader, so they never see it flash.
const bootScript = `try{if(sessionStorage.getItem("ag-booted")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.booted="1"}}catch(e){document.documentElement.dataset.booted="1"}`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "GetHelpDesk.ai" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Thapar Institute of Engineering & Technology" },
  url: profile.url,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <IntroProvider>{children}</IntroProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
