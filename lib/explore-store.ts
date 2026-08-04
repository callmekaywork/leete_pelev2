"use client";

import { useState, useEffect } from "react";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "Analyze" | "Design" | "Build" | "Implement";
  version: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  services: string[];
  totalPrice: number;
  status: "new" | "contacted" | "closed";
  date: string;
}

export const SERVICES: Service[] = [
  {
    id: "market-clarity",
    title: "Market Clarity",
    description:
      "Understand who you should serve and why. Clarity is the foundation of growth.",
    price: 1500,
    category: "Analyze",
    version: "v2.0",
  },
  {
    id: "market-positioning",
    title: "Market Positioning",
    description:
      "Define how you win in your chosen market. Strategy that differentiates.",
    price: 2500,
    category: "Analyze",
    version: "v2.0",
  },
  {
    id: "commercial-design",
    title: "Commercial Design",
    description:
      "Design offers that make commercial sense. Pricing and package optimization.",
    price: 3000,
    category: "Analyze",
    version: "v2.0",
  },
  {
    id: "value-infrastructure",
    title: "Value Infrastructure",
    description:
      "Build systems that turn effort into income. Backend excellence.",
    price: 4500,
    category: "Analyze",
    version: "v2.0",
  },
  {
    id: "digital-systems",
    title: "Digital Systems",
    description: "Digital platforms as growth infrastructure, not decoration.",
    price: 5000,
    category: "Analyze",
    version: "v2.0",
  },
];

export interface Application {
  id: string;
  name: string;
  email: string;
  company: string;
  businessStage: string;
  challenge: string;
  desiredOutcome: string;
  investmentReady: boolean;
  status: "pending" | "reviewed" | "accepted" | "declined";
  date: string;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  mobile: string;
  contactMethod: "Phone Call" | "Email" | "WhatsApp";
  hasBusiness: boolean;
  businessName?: string;
  industry?: string;
  businessStage?: string;
  teamSize?: string;
  website?: string;
  challenge: string;
  clarityGoal: string;
  implementationReady: string;
  preferredDateTime: string;
  status: "pending" | "confirmed" | "cancelled";
  date: string;
}

export function useExploreData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    const savedLeads = localStorage.getItem("govlead_leads");
    if (savedLeads) setLeads(JSON.parse(savedLeads));

    const savedApps = localStorage.getItem("govlead_apps");
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedCons = localStorage.getItem("govlead_cons");
    if (savedCons) setConsultations(JSON.parse(savedCons));
  }, []);

  const addLead = (lead: Lead) => {
    const newLeads = [lead, ...leads];
    setLeads(newLeads);
    localStorage.setItem("govlead_leads", JSON.stringify(newLeads));
  };

  const removeLead = (id: string) => {
    const newLeads = leads.filter((l) => l.id !== id);
    setLeads(newLeads);
    localStorage.setItem("govlead_leads", JSON.stringify(newLeads));
  };

  const addApplication = (app: Application) => {
    const newApps = [app, ...applications];
    setApplications(newApps);
    localStorage.setItem("govlead_apps", JSON.stringify(newApps));
  };

  const removeApplication = (id: string) => {
    const newApps = applications.filter((a) => a.id !== id);
    setApplications(newApps);
    localStorage.setItem("govlead_apps", JSON.stringify(newApps));
  };

  const addConsultation = (con: Consultation) => {
    const newCons = [con, ...consultations];
    setConsultations(newCons);
    localStorage.setItem("govlead_cons", JSON.stringify(newCons));
  };

  const removeConsultation = (id: string) => {
    const newCons = consultations.filter((c) => c.id !== id);
    setConsultations(newCons);
    localStorage.setItem("govlead_cons", JSON.stringify(newCons));
  };

  return {
    leads,
    addLead,
    removeLead,
    applications,
    addApplication,
    removeApplication,
    consultations,
    addConsultation,
    removeConsultation,
  };
}
