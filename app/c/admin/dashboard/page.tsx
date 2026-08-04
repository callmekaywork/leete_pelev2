"use client";

import { useState } from "react";
import { useTeamData, TeamMember } from "@/lib/team-store";
import {
  Plus,
  Trash2,
  Save,
  Undo,
  Users,
  Briefcase,
  Mail,
  Building,
  LayoutList,
  CheckCircle2,
  BarChart,
} from "lucide-react";
import { useExploreData } from "@/lib/explore-store";

import { useSession } from "next-auth/react";

import { redirect } from "next/navigation";
import { router } from "@/orpc/route";
import Loading from "@/app/loading";

export default function AdminPage() {
  const { team, updateTeam } = useTeamData();
  const { leads, removeLead } = useExploreData();
  const [activeTab, setActiveTab] = useState<"team" | "leads">("team");
  const [editingTeam, setEditingTeam] = useState<TeamMember[]>([]);

  const { data: session, status } = useSession();

  // Initialize editing state once team data is loaded
  useState(() => {
    if (team.length > 0 && editingTeam.length === 0) {
      setEditingTeam(team);
    }
  });

  const handleSave = () => {
    updateTeam(editingTeam);
    alert("Team updated successfully!");
  };

  const handleAddField = () => {
    const nextId =
      editingTeam.length > 0
        ? Math.max(...editingTeam.map((t) => t.id)) + 1
        : 1;
    setEditingTeam([
      ...editingTeam,
      {
        id: nextId,
        name: "New Member",
        role: "Role",
        bio: "Bio goes here...",
        focus: ["Energy"],
        image: `https://picsum.photos/seed/${nextId}/400/500`,
      },
    ]);
  };

  const removeMember = (id: number) => {
    setEditingTeam(editingTeam.filter((t) => t.id !== id));
  };

  const updateMember = (id: number, field: keyof TeamMember, value: string) => {
    setEditingTeam(
      editingTeam.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  if (status === "loading") {
    <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/c/admin/login");
  }

  if (status == "authenticated" && session?.user.role === "admin") {
    return (
      <main className="min-h-screen bg-background pb-12 font-sans">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                Control Panel
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Infrastructure management & lead intelligence.
              </p>
            </div>

            <div className="flex bg-white border-2 border-slate-900 rounded-2xl p-1.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <button
                onClick={() => setActiveTab("team")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "team" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
              >
                <Users className="w-4 h-4" /> TEAM
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
              >
                <Briefcase className="w-4 h-4" /> LEADS
              </button>
            </div>
          </div>

          {activeTab === "team" ? (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                >
                  <Save className="w-5 h-5" /> PERSIST CHANGES
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {editingTeam.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white border-4 border-slate-900 p-8 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6"
                  >
                    <div className="flex items-center justify-between pb-6 border-b-2 border-dashed border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white italic">
                          #{member.id}
                        </div>
                        <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                          Growth Driver Profile
                        </span>
                      </div>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-3 text-rose-500 hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                          Display Name
                        </label>
                        <input
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors font-bold text-lg"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(member.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                          Strategic Role
                        </label>
                        <input
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors font-bold text-lg"
                          value={member.role}
                          onChange={(e) =>
                            updateMember(member.id, "role", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                        Background Intelligence
                      </label>
                      <textarea
                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] outline-none focus:border-indigo-600 transition-colors font-medium text-slate-600 min-h-[120px] leading-relaxed"
                        value={member.bio}
                        onChange={(e) =>
                          updateMember(member.id, "bio", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddField}
                  className="w-full py-16 border-4 border-dashed border-slate-200 rounded-[56px] text-slate-300 font-black text-2xl flex flex-col items-center justify-center gap-4 hover:border-indigo-600 hover:text-indigo-600 transition-all hover:bg-indigo-50/20 group"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  INITIALIZE NEW SQUAD MEMBER
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-4 border-slate-900 rounded-[48px] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
              <div className="p-8 border-b-2 border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase italic">
                  <BarChart className="w-6 h-6 text-indigo-600" /> Lead Pipeline
                </h2>
                <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  {leads.length} ACTIVE INQUIRIES
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Contact
                      </th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Infrastructure
                      </th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Investment
                      </th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Origin
                      </th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Ops
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest"
                        >
                          Queue is empty. Deploy systems to generate heat.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-lg leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase italic">
                                {lead.name}
                              </span>
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <Building className="w-3 h-3" /> {lead.company}
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-1">
                                <Mail className="w-3 h-3" /> {lead.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                              {lead.services.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-wider"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="font-black text-indigo-600 text-xl">
                                ${lead.totalPrice.toLocaleString()}
                              </span>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">
                                ESTIMATED FEE
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-500">
                                {new Date(lead.date).toLocaleDateString()}
                              </span>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">
                                TIMESTAMP
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <button
                              onClick={() => removeLead(lead.id)}
                              className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}
