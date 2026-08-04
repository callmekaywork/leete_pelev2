"use client";

import { useState, useEffect } from "react";

export interface Project {
  title: string;
  year: string;
  impact: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  focus: string[];
  image: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  history?: Project[];
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Govern Skosana",
    role: "CEO & Principal Strategist",
    bio: "Leading GovLead with over 5 years of experience in market positioning and scaling systems for high-growth startups.",
    focus: ["Market Positioning", "Scaling Systems", "Visionary Leadership"],
    image: "/team/govern.jpeg",
    email: "govern@govleadgroup.co.za",
    linkedin: "#",
    twitter: "#",
    history: [
      {
        title: "Global Fintech Expansion",
        year: "2023",
        impact: "Scaled user base by 300% in 12 months.",
      },
      {
        title: "SaaS Structural Reset",
        year: "2022",
        impact: "Optimized burn rate by 40% while maintaining growth.",
      },
    ],
  },
  {
    id: 2,
    name: "Zanele Tyobela",
    role: "Lead Manager",
    bio: "Leading with a clear mindset",
    focus: ["Visual Design", "UX Strategy", "Conversion Optimization"],
    image: "/team/zanele.jpeg",
    email: "zanele@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 3,
    name: "Khotso Nyokong",
    role: "Lead Systems Architect",
    bio: "The engine behind our automation. Khotso builds the robust infrastructures that turn strategy into income.",
    focus: ["Business Automation", "CRM Integration", "Data Flow"],
    image: "/team/Khotso.png",
    email: "khotso@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Automation Pipeline",
        year: "2023",
        impact: "Automated 70% of manual lead processing.",
      },
      {
        title: "Data Sovereignty Project",
        year: "2022",
        impact: "Secured data for government-tier scalability.",
      },
    ],
  },
  {
    id: 4,
    name: " Boipelo Solwane",
    role: "Sales Manager",
    bio: "",
    focus: ["Sales"],
    image: "/team/Boipelo.png",
    email: "boipelo@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 5,
    name: "Kabelo Mabasa",
    role: " Marketing Research specialist ",
    bio: "",
    focus: [" Marketing Research"],
    image: "/team/Kabelo.jpeg",
    email: "kabelo@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 6,
    name: " Ngwako Mothapo",
    role: "Information Technology Expert",
    bio: "",
    focus: ["Website Design "],
    image: "/team/ngwako.jpeg",
    email: "ngwako@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 7,
    name: "Lebogang Liphadzi",
    role: "Sales Strategy Analyst ",
    bio: "",
    focus: ["Sales"],
    image: "/team/Lebogang.jpeg",
    email: "lebogang@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 8,
    name: "Tiyiselani Hlungwane,",
    role: "Graphic Designer",
    bio: "",
    focus: ["Graphic Designer "],
    image: "/team/Tiyiselani.jpeg",
    email: "tiyiselani@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 9,
    name: "Ithuteng Malesa",
    role: "Information Technology Intern",
    bio: "",
    focus: ["Sales "],
    image: "/team/Ithuteng.jpeg",
    email: "ithuteng@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 10,
    name: "Mosimanegape Boys Moale",
    role: "Sales",
    bio: "",
    focus: ["Sales "],
    image: "/team/Mosimanegape.jpeg",
    email: "mosimanegape@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  {
    id: 11,
    name: "Ngomani Velaphi",
    role: "Graphic Designer",
    bio: "",
    focus: ["Graphic Designer "],
    image: "/team/Ngomani.jpeg",
    email: "ngomani@govleadgroup.co.za",
    linkedin: "#",
    history: [
      {
        title: "Identity Rebrand",
        year: "2023",
        impact: "Replaced legacy systems with v2.0 design language.",
      },
      {
        title: "Conversion Audit",
        year: "2023",
        impact: "Boosted checkout conversions by 18%.",
      },
    ],
  },
  // {
  //   id: 4,
  //   name: "Elena Rossi",
  //   role: "Digital Execution Specialist",
  //   bio: "Specializing in high-performance digital campaigns that cut through the noise with intention and precision.",
  //   focus: ["Paid Media", "Growth Analytics", "Content Pipeline"],
  //   image: "https://picsum.photos/seed/elena/400/500",
  // },
  // {
  //   id: 5,
  //   name: "James Wilson",
  //   role: "Operations Manager",
  //   bio: "Ensuring sustainable growth through operational excellence and framework development.",
  //   focus: ["Ops Management", "Frameworks", "Sustainable Income"],
  //   image: "https://picsum.photos/seed/james/400/500",
  // },
  // {
  //   id: 6,
  //   name: "Lila Vance",
  //   role: "Growth Marketing Lead",
  //   bio: "Expert in viral loops and retention strategies. Lila has helped 50+ startups lower their CAC by 40%.",
  //   focus: ["Viral Loops", "Retention", "Growth Hacking"],
  //   image: "https://picsum.photos/seed/lila/400/500",
  // },
  // {
  //   id: 7,
  //   name: "Kenji Sato",
  //   role: "Full Stack Engineer",
  //   bio: "Bridging the gap between design and functionality. Kenji builds lightning-fast web applications.",
  //   focus: ["React/Next.js", "Node.js", "Cloud Architecture"],
  //   image: "https://picsum.photos/seed/kenji/400/500",
  // },
  // {
  //   id: 8,
  //   name: "Maya Gupta",
  //   role: "Content Strategist",
  //   bio: "Storytelling with a purpose. Maya crafts narratives that build trust and authority in competitive markets.",
  //   focus: ["Copywriting", "Brand Voice", "Inbound"],
  //   image: "https://picsum.photos/seed/maya/400/500",
  // },
  // {
  //   id: 9,
  //   name: "Tom Hedges",
  //   role: "Sales Optimization",
  //   bio: "Closing the loop. Tom designs high-converting sales scripts and follow-up sequences.",
  //   focus: ["Sales Scripts", "CRM Ops", "Negotiation"],
  //   image: "https://picsum.photos/seed/tom/400/500",
  // },
  // {
  //   id: 10,
  //   name: "Zoe Brooks",
  //   role: "Product Manager",
  //   bio: "Transforming ideas into roadmaps. Zoe ensures that speed of thought translates into speed of delivery.",
  //   focus: ["Agile", "Product Vision", "Roadmapping"],
  //   image: "https://picsum.photos/seed/zoe/400/500",
  // },
];

export function useTeamData() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("govlead_team");
    if (saved) {
      setTeam(JSON.parse(saved));
    } else {
      setTeam(DEFAULT_TEAM);
      localStorage.setItem("govlead_team", JSON.stringify(DEFAULT_TEAM));
    }
  }, []);

  const updateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem("govlead_team", JSON.stringify(newTeam));
  };

  return { team, updateTeam };
}
