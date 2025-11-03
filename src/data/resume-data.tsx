import type { ResumeData } from "@/lib/types";

export const RESUME_DATA: ResumeData = {
  name: "Arnav Gupta",
  initials: "AG",
  location: "Patiala, Punjab",
  locationLink: "https://www.google.com/maps/place/Patiala,+Punjab",
  about: "Bachelor of Engineering in Computer Science with a focus on AI/ML and full-stack development.",
  summary: (
    <>
      As a Final year Computer Science student at Thapar Institute of Engineering and Technology, I have hands-on experience in full-stack web development, AI-driven projects, and application development. I have led teams in extracurricular activities, delivering projects that significantly increased user engagement. I am proficient in multiple programming languages and modern development frameworks.
    </>
  ),
  avatarUrl: "https://res.cloudinary.com/dnrxsykwg/image/upload/v1762158828/me_cqxizl.jpg",
  personalWebsiteUrl: "https://arnavxgupta.vercel.app/",
  contact: {
    email: "arnav090404@gmail.com",
    tel: "+917986294705",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/arnavXgupta",
        icon: "github",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/arnav-gupta-a810ba260/",
        icon: "linkedin",
      },
    ],
  },
  education: [
    {
      school: "Thapar Institute of Engineering and Technology",
      degree: "Bachelor of Engineering in Computer Science - CGPA:7.00",
      start: "2022",
      end: "2026",
    },
    {
      school: "Sudesh Vatika Convent School",
      degree: "12th Grade - 78%",
      start: "2021",
      end: "2022",
    },
    {
      school: "St. Joseph Sen. Sec. School",
      degree: "10th Grade - 91.2%",
      start: "2019",
      end: "2020",
    },
  ],
  work: [
    {
      company: "Varnan",
      link: "https://varnan.tech",
      badges: ["Next.js", "Tailwind CSS", "Sanity CMS", "RSS"],
      title: "Freelance Web Developer",
      start: "May 2025",
      end: "July 2025",
      description: "Led a major platform overhaul using Next.js and Tailwind CSS, integrating a custom Sanity CMS blog and an RSS feed to enhance UI/UX, boost user engagement, and expand audience reach by 30,000.",
    },
    {
      company: "NiveshX",
      link: "https://github.com/arnavXgupta/NiveshBuddy_Frontend",
      badges: ["React.js", "Firebase", "UI/UX"],
      title: "Frontend Developer & UI/UX Designer",
      start: "May 2024",
      end: "July 2024",
      description:
        "Spearheaded the development of a comprehensive financial management platform, enhancing user experience and engagement through intuitive UI/UX design and seamless integration with Firebase for real-time data handling.",
    },
    {
      company: "Chemical Department, TIET",
      link: "https://sdcee2024.thapar.edu/",
      badges: ["HTML/CSS", "Javascript", "Figma"],
      title: "UI/UX Design Head",
      start: "Oct 2023",
      end: "Feb 2024",
      description:
        "Designed the Frontend for the International Conference on Sustainable Development in Chemical Engineering, attracting over 10,000+ global users and enhancing participant interaction and engagement.",
    },
  ],
  skills: [
    "Java",
    "Python",
    "C++",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "React.js",
    "Tailwind CSS",
    "FastAPI",
    "Node.js",
    "Firebase",
    "MySQL",
    "MongoDB",
    "Pinecone",
    "Firebase",
    "Sanity CMS",
    "GenAI",
    "LangChain",
    "OpenAI",
    "Gemini",
    "Git",
    "GitHub",
  ],
  domains: [
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
    "AI/ML Integration",
  ],
  projects: [
    {
      title: "Cognivia",
      techStack: ["React.js", "Tailwind CSS", "FastAPI", "Llama", "Pinecone", "MongoDB", "Gemini"],
      description:
        "Cognivia is an AI-powered study co-pilot that allows users to upload PDFs and YouTube videos to generate notes, create study plans, and chat directly with their learning materials.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/Cognivia",
      },
    },
    {
      title: "Atelier Hub",
      techStack: ["React.js", "Tailwind CSS", "FastAPI", "LangChain", "Pinecone"],
      description:
        "Ikarus Atelier is an AI-powered, full-stack furniture recommendation app that uses conversational search and generative AI to provide personalized suggestions and create unique product descriptions.",
      link: {
        label: "github.com",
        href: "https://ikarus-3s4a.vercel.app/",
      },
    },
    {
      title: "TailorMate",
      techStack: ["Java", "Object Oriented Programming", "JavaFX", "Scene Builder", "MySQL", "Maven"],
      description:
        "TailorMate is a boutiques and tailor shop management system designed to streamline order management, track customer details, and optimize workflow.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/TailorMate",
      },
    },
    {
      title: "DocuPrism RAG",
      techStack: ["Python", "FastAPI", "Pinecone", "OpenAI", "Gemini", "LangChain"],
      description:
        "This project is a high-performance, scalable Retrieval-Augmented Generation (RAG) pipeline designed to answer questions about complex documents provided via a URL.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/DocuPrism-RAG/",
      },
    },
    {
      title: "Arula Landing Page",
      techStack: ["Next.js", "Tailwind CSS", "Vercel"],
      description:
        "Arula is a responsive, single-page website built with Next.js and Tailwind CSS, featuring multiple sections like a hero, stats, FAQs, and a contact form.",
      link: {
        label: "github.com",
        href: "https://arula-asgn.vercel.app/",
      },
    },
    {
      "title": "IntelliMatch",
      "techStack": ["Python", "Openai", "Gemini"],
      "description": "IntelliMatch is an intelligent recruitment platform that automates the process of shortlisting top candidates by using AI to score and rank them based on how well their resumes match job descriptions.",
      "link": {
        "label": "github.com",
        "href": "https://github.com/arnavXgupta/IntelliMatch"
      }
    },
    {
      title: "Autonomous Pothole Detection & 3D Reconstruction",
      techStack: ["YOLO", "LiDAR", "Transformers", "ICP"],
      description:
        "Our capstone team of four is developing a real-time autonomous system that fuses LiDAR and RGB camera data to accurately detect and map potholes, enhancing road safety.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/",
      },
    },
    {
      "title": "Stock Analysis",
      "techStack": ["Python", "Pandas", "AlphaVantage", "Plotly"],
      "description": "A comprehensive stock analysis tool that provides real-time data, interactive visualizations, and key financial metrics for any publicly traded company in the US. It analyses based on the indicators: SMA, EMA, MACD, Stochastic Oscillators, Boillinger Bands and RSI",
      "link": {
        "label": "github.com",
        "href": "https://github.com/arnavxgupta/stock-analysis"
      }
    },
    {
      "title": "SmartShop AI",
      "techStack": ["Python", "FastAPI", "OpenAI", "Pandas", "Streamlit"],
      "description": "An AI-powered Walmart shopping assistant that provides personalized product recommendations based on user queries.",
      "link": {
        "label": "github.com",
        "href": "https://github.com/arnavxgupta/smartshop-ai"
      }
    },
  ],
} as const;