// Single source of truth for every visible string on the site.
// Copy rule: no em-dashes, one CTA label per intent.

export const profile = {
  name: "Arnav Gupta",
  role: "AI Engineer and Full-Stack Engineer",
  email: "arnav090404@gmail.com",
  github: "https://github.com/arnavXgupta",
  linkedin: "https://linkedin.com/in/arnav-gupta-a810ba260",
  x: "https://x.com/_Arnav09_",
  phone: "+91-7986294705",
  phoneHref: "tel:+917986294705",
  whatsapp: `https://wa.me/917986294705?text=${encodeURIComponent("Hi Arnav, I came across your portfolio and would like to talk about an opportunity.")}`,
  xHandle: "@_Arnav09_",
  resume: "/Arnav_Gupta_Resume.pdf",
  location: "Punjab, India. Working remote in IST.",
  url: "https://arnavxgupta.vercel.app",
} as const;

export const hero = {
  headline: ["Full-stack engineer", "with an AI edge."],
  accent: "AI edge.",
  // The sub-line cycles through what Arnav ships; each must read after "I ship".
  rotating: ["RAG pipelines", "LLM agents", "FastAPI backends", "Next.js products", "real-time apps"],
  subAfter: "end to end: the LLM layer, the API and the interface. Currently at GetHelpDesk.ai.",
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  kind: string;
  summary: string;
  points: string[];
  stack: string[];
  pipeline?: boolean;
};

export const experience: Experience[] = [
  {
    company: "GetHelpDesk.ai",
    role: "Software Engineer",
    period: "Jan 2026 - Present",
    kind: "Full-time, remote",
    summary:
      "I build and maintain the backend of an LLM-powered calling product for dental clinics, from the FastAPI services to the pipeline that handles each call.",
    points: [
      "Diagnosed and fixed critical production issues in the calling pipeline, cutting the error rate by 90%.",
      "Shipped backend fixes that reduced failed calls by 20%.",
      "Own client onboarding and customise voice workflows for each clinic.",
    ],
    stack: ["Python", "Pipecat", "FastAPI", "LLMs", "STT / TTS"],
    pipeline: true,
  },
  {
    company: "Varnan",
    role: "Web Developer Intern",
    period: "May 2025 - Jul 2025",
    kind: "Internship, remote",
    summary: "Rebuilt the platform frontend and gave the team a publishing engine they could run themselves.",
    points: [
      "Rebuilt the frontend in Next.js with a responsive, faster and more consistent UI.",
      "Built a Sanity CMS blog with RSS syndication that grew reach by 30,000 users.",
    ],
    stack: ["Next.js", "Tailwind CSS", "Sanity CMS", "RSS"],
  },
  {
    company: "Chemical Engineering Dept, TIET",
    role: "UI/UX Designer",
    period: "Oct 2023 - Feb 2024",
    kind: "Design",
    summary:
      "Designed the experience for the International Conference on Sustainable Development in Chemical Engineering.",
    points: ["The conference site reached more than 10,000 users worldwide."],
    stack: ["UI/UX", "Figma"],
  },
];

export const education = {
  school: "Thapar Institute of Engineering & Technology",
  degree: "BE, Computer Science",
  period: "2022 - 2026",
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  problem: string;
  built: string[];
  stack: string[];
  links: { label: string; href: string }[];
  /** Shown in the detail view when there are no public links. */
  status?: string;
  visual: "rag" | "chunks" | "roles" | "fanout" | "listings";
};

export const projects: Project[] = [
  {
    slug: "urban-realities",
    name: "Urban Realities",
    tagline: "My startup: a rentals and PG discovery portal for Bathinda, with a dashboard for owners and brokers.",
    year: "2026",
    problem:
      "Finding a PG or a rental in Bathinda means phone calls and word of mouth. Urban Realities is the startup I'm building to fix that: residential rentals, commercial rentals and PG rooms in one place, with a dashboard where owners and brokers manage their listings.",
    built: [
      "Built the public site and the lister dashboard in ASP.NET Core 8 MVC, on top of two REST APIs.",
      "Listing rails and filters with a dual-range price slider, wishlists, enquiry forms and WhatsApp contact.",
      "Moved login and signup to dedicated routes, added per-page SEO tags, and tuned font loading and caching for speed.",
    ],
    stack: ["ASP.NET Core 8", "C#", "Razor", "REST APIs", "JavaScript", "CSS"],
    links: [],
    status: "My own startup, in active development. It isn't public yet.",
    visual: "listings",
  },
  {
    slug: "docuprism",
    name: "DocuPrism-RAG",
    tagline: "Ask questions of any document by URL.",
    year: "2025",
    problem:
      "A production-shaped RAG API: send a document link and a list of questions, get grounded answers back fast.",
    built: [
      "Semantic chunking with PyMuPDF and Unstructured, embedded into Pinecone.",
      "Multilingual answers through OpenAI and Gemini.",
      "Async concurrent processing with bearer token auth.",
    ],
    stack: ["FastAPI", "Pinecone", "OpenAI", "Gemini", "PyMuPDF"],
    links: [{ label: "GitHub", href: "https://github.com/arnavXgupta/DocuPrism-RAG" }],
    visual: "chunks",
  },
  {
    slug: "arula-connect",
    name: "Arula-Connect",
    tagline: "A closed, real-time therapy network for autism support.",
    year: "2026",
    problem:
      "Parents, therapists and group leaders need to talk safely. Arula-Connect is admin-provisioned only, with a strict permission matrix deciding who can reach whom.",
    built: [
      "Cross-platform iOS and Android app from one Expo codebase.",
      "Real-time messaging over Socket.IO, with Redis for sessions and presence.",
      "File sharing through AWS S3 pre-signed URLs and role-based access control.",
    ],
    stack: ["React Native", "Expo", "Fastify", "Socket.IO", "PostgreSQL", "Redis", "AWS S3"],
    links: [],
    status: "Client work. The app and its code aren't publicly accessible.",
    visual: "roles",
  },
  {
    slug: "social-automation",
    name: "AI Social Automation",
    tagline: "One video script in, a post for every platform out.",
    year: "2025",
    problem:
      "Repurposing one script for YouTube, Instagram and X used to take hours of manual rewriting and scheduling.",
    built: [
      "LLM pipeline that rewrites a script into platform-specific posts.",
      "An evaluation loop that scores drafts on engagement heuristics and rewrites weak ones.",
      "Idempotent scheduled posting through Composio, cutting manual effort by 95%+.",
    ],
    stack: ["Python", "FastAPI", "Composio", "LLM APIs"],
    links: [{ label: "Crosspost repo", href: "https://github.com/arnavXgupta/Crosspost-Automation" }],
    visual: "fanout",
  },
  {
    slug: "cognivia",
    name: "Cognivia",
    tagline: "An e-learning platform that reads your material and teaches it back.",
    year: "2025",
    problem:
      "Students drown in PDFs and lecture videos. Cognivia turns them into a searchable knowledge base, a personal study plan and a tutor that only answers from your sources.",
    built: [
      "Ingestion pipeline for 10,000+ documents, covering PDFs and YouTube transcripts.",
      "RAG over a self-hosted LLaMA model on Ollama, with Pinecone vector search.",
      "Personalised study plans and a contextual chatbot, behind JWT auth.",
    ],
    stack: ["Next.js", "FastAPI", "LangChain", "Ollama", "Pinecone", "MongoDB"],
    links: [{ label: "GitHub", href: "https://github.com/arnavXgupta/Cognivia" }],
    visual: "rag",
  },
];

export type ArchiveItem = {
  name: string;
  note: string;
  stack: string;
  year: string;
  /** Where the row links to. */
  href: string;
  /** Public GitHub repo, used for the hover preview card. */
  repo?: string;
  live?: string;
  liveLabel?: string;
};

export const archive: ArchiveItem[] = [
  {
    name: "Hermes Voice Door",
    note: "Talk to an autonomous agent that builds and edits live websites on Cloudflare Pages",
    stack: "OpenAI Realtime, WebRTC, Cloudflare Workers, Node.js",
    year: "2026",
    href: "https://github.com/arnavXgupta/Hermes-voice-door",
    repo: "Hermes-voice-door",
  },
  {
    name: "YT Shorts Pipeline",
    note: "Automated pipeline that produces and publishes Shorts for the @NofaceXAI channel",
    stack: "AI content automation",
    year: "2026",
    href: "https://www.youtube.com/@NofaceXAI",
  },
  { name: "TailorMate", note: "Desktop order, customer and billing manager for tailor shops", stack: "Java, Spring, Maven", year: "2024", href: "https://github.com/arnavXgupta/TailorMate", repo: "TailorMate" },
];

/** Frontend-only sites, shown together on one line under the archive rows. */
export const frontendBuilds = [
  { name: "Arula", note: "Autism support service", href: "https://arula-mu.vercel.app", domain: "arula-mu.vercel.app" },
  { name: "gNext Biofuel", note: "Biomass pellet manufacturer, Bathinda", href: "https://gnextbiofuel.com", domain: "gnextbiofuel.com" },
  { name: "Lakshika Bansal", note: "Tarot readings, Next.js and Three.js", href: "https://lakshikabansal.vercel.app", domain: "lakshikabansal.vercel.app" },
] as const;

export const skillGroups = [
  { title: "AI and LLM", items: ["Pipecat", "LangChain", "OpenAI API", "Gemini API", "Ollama", "Composio", "RAG", "Embeddings", "Voice AI"] },
  { title: "Backend", items: ["Python", "FastAPI", "Fastify", "Node.js", "Flask", "Spring Boot", "Java", "C#", "ASP.NET Core"] },
  { title: "Frontend and mobile", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "React Native", "Expo", "Zustand"] },
  { title: "Data and infra", items: ["PostgreSQL", "MongoDB", "Redis", "Pinecone", "Supabase", "AWS S3", "Docker", "Socket.IO"] },
  { title: "ML and vision", items: ["YOLOv8", "CUDA", "OpenCV", "Scikit-learn", "NumPy", "Pandas", "NLTK"] },
] as const;

export const vortexPhrase = "PYTHON / PIPECAT / FASTAPI / LANGCHAIN / PINECONE / NEXT.JS / TYPESCRIPT / REDIS / ";
