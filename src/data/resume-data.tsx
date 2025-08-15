import type { ResumeData } from "@/lib/types";

export const RESUME_DATA: ResumeData = {
  name: "Arnav Gupta",
  initials: "AG",
  location: "Patiala, Punjab",
  locationLink: "https://www.google.com/maps/place/Patiala,+Punjab",
  about: "Bachelor of Engineering in Computer Science with a focus on AI/ML and full-stack development.",
  summary: (
    <>
      As a Computer Science student at Thapar Institute of Engineering and Technology, I have hands-on experience in full-stack web development, AI-driven projects, and application development. I have led teams in extracurricular activities, delivering projects that significantly increased user engagement. I am proficient in multiple programming languages and modern development frameworks.
    </>
  ),
  avatarUrl: "https://avatars.githubusercontent.com/u/1017620?v=4",
  personalWebsiteUrl: "https://www.putlink.com",
  contact: {
    email: "arnav090404@gmail.com",
    tel: "7986294705",
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
      degree: "Bachelor of Engineering in Computer Science",
      start: "2022",
      end: "2026",
    },
  ],
  work: [
    {
      company: "Varnan",
      link: "https://www.putlink.com",
      badges: ["Remote", "Next.js", "Tailwind CSS", "Sanity CMS"],
      title: "Freelance Web Developer",
      start: "May 2025",
      end: "July 2025",
      description: (
        <>
          <ul className="list-inside list-disc">
            <li>
              Developed a major platform overhaul using Next.js and Tailwind CSS, implementing a clean and sleek UI that elevated the brand's premium aesthetic and improved user experience.
            </li>
            <li>
              Developed and integrated a custom, high-performance blog using Sanity CMS, which directly led to a significant increase in user engagement and content interaction.
            </li>
            <li>
              Engineered and implemented an RSS feed to syndicate content and expand audience reach, successfully growing the platform's user reach by an additional 30,000.
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "Microsoft Learn Student Chapter",
      link: "https://www.putlink.com",
      badges: ["TIET"],
      title: "Coordinator",
      start: "Apr 2023",
      end: "Jun 2024",
      description: (
        <>
          Led a team of 10 in designing and launching the official society website and the Makeathon 6 event portal, driving a 150% increase in user engagement and significantly enhancing online visibility.
        </>
      ),
    },
    {
      company: "Chemical Department, TIET",
      link: "https://www.putlink.com",
      badges: ["TIET"],
      title: "UI/UX Design Head",
      start: "Oct 2023",
      end: "Feb 2024",
      description:
        "Designed the UI/UX for the International Conference on Sustainable Development in Chemical Engineering, attracting over 10,000+ global users and enhancing participant interaction and engagement.",
    },
  ],
  skills: [
    "Java",
    "Python",
    "C++",
    "JavaScript",
    "SQL",
    "React.js",
    "Next.js",
    "Node.js",
    "Spring Boot",
    "FastAPI",
    "Tailwind CSS",
    "LangChain",
    "PyTorch",
    "LLMs",
    "MySQL",
    "MongoDB",
    "Git",
    "GitHub",
  ],
  projects: [
    {
      title: "TailorMate",
      techStack: ["Java", "Object Oriented Programming", "JavaFX", "Scene Builder", "MySQL"],
      description:
        "Led the development of a desktop application to streamline inefficient tailor shop operations, reducing order processing time by 30% and improving customer delivery accuracy by 25%.",
      link: {
        label: "github.com",
        href: "https://www.putlink.com",
      },
    },
    {
      title: "DocuPrism RAG",
      techStack: ["Python", "FastAPI", "Pinecone", "OpenAI", "Gemini", "LangChain"],
      description:
        "Developed a scalable, production-ready RAG API capable of handling concurrent queries by leveraging a fully asynchronous architecture for parallelized retrieval and generation tasks.",
      link: {
        label: "github.com",
        href: "https://www.putlink.com",
      },
    },
    {
      title: "Autonomous Pothole Detection & 3D Reconstruction",
      techStack: ["YOLO", "LiDAR", "Transformers", "ICP"],
      description:
        "Partnered with a team of 4 on developing the AI-driven software pipeline for a drone-assisted pothole detection and mapping system, aiming to significantly reduce municipal costs and improve infrastructure management.",
      link: {
        label: "github.com",
        href: "https://www.putlink.com",
      },
    },
  ],
} as const;