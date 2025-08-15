import type { ResumeData } from "@/lib/types";

export const RESUME_DATA: ResumeData = {
  name: "Arnav Gupta",
  initials: "AG",
  location: "Bathinda, Punjab",
  locationLink: "https://www.google.com/maps/place/Patiala,+Punjab",
  about: "Bachelor of Engineering in Computer Science with a focus on AI/ML and full-stack development.",
  summary: (
    <>
      As a Final year Computer Science student at Thapar Institute of Engineering and Technology, I have hands-on experience in full-stack web development, AI-driven projects, and application development. I have led teams in extracurricular activities, delivering projects that significantly increased user engagement. I am proficient in multiple programming languages and modern development frameworks.
    </>
  ),
  avatarUrl: "https://www.putlink.com",
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
    {
      school: "Sudesh Vatika Convent School",
      degree: "12th Grade",
      start: "2021",
      end: "2022",
    },
    {
      school: "St. Joseph Sen. Sec. School",
      degree: "10th Grade",
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
      company: "NiveshX",
      link: "https://github.com/arnavXgupta/",
      badges: ["React.js", "Firebase", "UI/UX"],
      title: "Frontend Developer & UI/UX Designer",
      start: "May 2024",
      end: "July 2024",
      description: (
        <>
          <ul className="list-inside list-disc">
            <li>
              Spearheaded the development of a comprehensive financial management platform, enhancing user experience and engagement through intuitive UI/UX design and seamless integration with Firebase for real-time data handling.
            </li>
          </ul>
        </>
      ),
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
        href: "https://github.com/arnavXgupta/TailorMate",
      },
    },
    {
      title: "DocuPrism RAG",
      techStack: ["Python", "FastAPI", "Pinecone", "OpenAI", "Gemini", "LangChain"],
      description:
        "Developed a scalable, production-ready RAG API capable of handling concurrent queries by leveraging a fully asynchronous architecture for parallelized retrieval and generation tasks.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/Bajaj-RAG",
      },
    },
    {
      title: "Autonomous Pothole Detection & 3D Reconstruction",
      techStack: ["YOLO", "LiDAR", "Transformers", "ICP"],
      description:
        "Partnered with a team of 4 on developing the AI-driven software pipeline for a drone-assisted pothole detection and mapping system, aiming to significantly reduce municipal costs and improve infrastructure management.",
      link: {
        label: "github.com",
        href: "https://github.com/arnavXgupta/",
      },
    },
  ],
} as const;