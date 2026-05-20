"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

import {
  Search,
  Trash2,
  Mail,
  ChevronRight,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { useMemo, useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  return res.json();
};

async function approveProposal(id: string) {
  await fetch("/api/approve-proposal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

async function deleteLead(id: string) {
  await fetch("/api/delete-lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

function getStatusStyle(status: string) {
  if (status === "Approved") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "Sent") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (status === "Closed") {
    return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

function getInitials(name: string) {
  return name
    ?.split(" ")
    ?.map((part: string) => part[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();
}

export default function DashboardClient() {
  const { data: leads = [], mutate } = useSWR("/api/leads", fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: true,
  });

  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const { data: activitiesData } = useSWR(
    selectedLead ? `/api/lead-activities/${selectedLead.id}` : null,
    fetcher,
  );

  const activities = Array.isArray(activitiesData) ? activitiesData : [];

  const approvedCount = leads.filter(
    (lead: any) => lead.proposal_status === "Approved",
  ).length;

  const sentCount = leads.filter(
    (lead: any) => lead.proposal_status === "Sent",
  ).length;

  const closedCount = leads.filter(
    (lead: any) => lead.proposal_status === "Closed",
  ).length;

  const highQualityCount = leads.filter(
    (lead: any) => lead.lead_quality === "High",
  ).length;

  const draftCount = leads.filter(
    (lead: any) => lead.proposal_status === "Draft",
  ).length;

  const chartData = [
    {
      name: "Draft",
      value: draftCount,
      color: "#f59e0b",
    },
    {
      name: "Approved",
      value: approvedCount,
      color: "#10b981",
    },
    {
      name: "Sent",
      value: sentCount,
      color: "#2563eb",
    },
    {
      name: "Closed",
      value: closedCount,
      color: "#52525b",
    },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter((lead: any) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.message?.toLowerCase().includes(search.toLowerCase());

      if (filter === "approved") {
        return matchesSearch && lead.proposal_status === "Approved";
      }

      if (filter === "draft") {
        return matchesSearch && lead.proposal_status === "Draft";
      }

      if (filter === "sent") {
        return matchesSearch && lead.proposal_status === "Sent";
      }

      return matchesSearch;
    });
  }, [leads, search, filter]);

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-black">
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="!w-[95vw] !max-w-[1100px] max-h-[92vh] p-0 border border-black/[0.08] rounded-lg overflow-hidden bg-white flex flex-col">
          <DialogDescription className="sr-only">
            Lead details and activity timeline
          </DialogDescription>

          {selectedLead && (
            <div className="w-full flex-1 flex flex-col xl:flex-row overflow-hidden min-h-0">
              {/* Main content */}
              <div className="flex-1 min-w-0 overflow-y-auto bg-white">
                <DialogHeader className="px-6 py-5 border-b border-black/[0.06] bg-white sticky top-0 z-20">
                  <div className="flex items-start justify-between gap-4 pr-8">
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="text-xl font-semibold tracking-tight leading-tight">
                        {selectedLead.name}
                      </DialogTitle>
                      <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                        <p className="text-sm text-zinc-500 break-all">
                          {selectedLead.email}
                        </p>
                        <div
                          className={`h-6 px-2.5 rounded border text-xs font-medium flex items-center shrink-0 ${getStatusStyle(
                            selectedLead.proposal_status,
                          )}`}
                        >
                          {selectedLead.proposal_status}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-5">
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Lead Quality",
                        value: selectedLead.lead_quality || "N/A",
                      },
                      {
                        label: "Urgency",
                        value: selectedLead.urgency || "N/A",
                      },
                      {
                        label: "Buyer Intent",
                        value: selectedLead.buyer_intent || "N/A",
                      },
                      {
                        label: "Project Size",
                        value: selectedLead.project_size || "N/A",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="border border-black/[0.06] bg-[#fafafa] rounded-md p-4"
                      >
                        <p className="text-[11px] uppercase tracking-wide text-zinc-400 font-medium">
                          {item.label}
                        </p>
                        <h3 className="text-sm font-semibold mt-2 break-words text-zinc-800">
                          {item.value}
                        </h3>
                      </div>
                    ))}
                  </div>

                  {/* AI Analysis */}
                  <div className="border border-black/[0.06] rounded-md p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <h2 className="text-sm font-semibold">AI Analysis</h2>
                    </div>
                    <p className="text-sm leading-7 text-zinc-600 whitespace-pre-wrap break-words">
                      {selectedLead.ai_reason || "No AI analysis available"}
                    </p>
                  </div>

                  {/* Client Message */}
                  <div className="border border-black/[0.06] rounded-md p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <h2 className="text-sm font-semibold">Client Message</h2>
                    </div>
                    <p className="text-sm leading-7 text-zinc-600 whitespace-pre-wrap break-words">
                      {selectedLead.message}
                    </p>
                  </div>

                  {/* AI Proposal Draft */}
                  <div className="border border-black/[0.06] rounded-md p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-blue-600 shrink-0" />
                      <h2 className="text-sm font-semibold">
                        AI Proposal Draft
                      </h2>
                    </div>
                    <div
                      className="prose prose-sm prose-zinc max-w-none break-words
                [&>p]:leading-7 [&>p]:text-zinc-600 [&>p]:mb-4
                [&>h1]:text-base [&>h1]:font-semibold [&>h1]:mb-3 [&>h1]:mt-5
                [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:mt-4
                [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4
                [&>ul]:mb-4 [&>ul]:pl-4 [&>ul>li]:mb-1 [&>ul>li]:text-sm [&>ul>li]:text-zinc-600 [&>ul>li]:leading-6
                [&>ol]:mb-4 [&>ol]:pl-4 [&>ol>li]:mb-1 [&>ol>li]:text-sm [&>ol>li]:text-zinc-600 [&>ol>li]:leading-6
              "
                    >
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {selectedLead.proposal_text ||
                          "No proposal generated yet"}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline sidebar */}
              <div className="w-full xl:w-[320px] border-t xl:border-t-0 xl:border-l border-black/[0.06] bg-[#fafafa] flex flex-col max-h-[40vh] xl:max-h-none shrink-0">
                <div className="px-5 py-4 border-b border-black/[0.06] bg-white sticky top-0 z-10 shrink-0">
                  <h2 className="text-sm font-semibold">Activity Timeline</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                  {activities.length === 0 ? (
                    <div className="p-5 text-sm text-zinc-400">
                      No activities yet
                    </div>
                  ) : (
                    activities.map((activity: any, index: number) => (
                      <div
                        key={activity.id}
                        className={`px-5 py-4 ${
                          index !== activities.length - 1
                            ? "border-b border-black/[0.05]"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="pt-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <p className="text-xs font-semibold text-zinc-800 break-words">
                                {activity.activity_type}
                              </p>
                              <p className="text-[11px] text-zinc-400 whitespace-nowrap shrink-0">
                                {new Date(
                                  activity.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-500 leading-6 break-words">
                              {activity.activity_text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <header className="h-16 border-b border-black/[0.06] bg-white sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">
          <h1 className="text-[18px] font-semibold tracking-tight">
            Dashboard
          </h1>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="h-10 w-[280px] bg-[#f7f7f8] border border-black/[0.06] rounded-md pl-11 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            {
              label: "Total Leads",
              value: leads.length,
            },
            {
              label: "Approved",
              value: approvedCount,
            },
            {
              label: "Sent",
              value: sentCount,
            },
            {
              label: "Closed",
              value: closedCount,
            },
            {
              label: "High Quality",
              value: highQualityCount,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-black/[0.06] rounded-md p-5"
            >
              <p className="text-sm text-zinc-500">{item.label}</p>

              <h2 className="text-[32px] font-semibold tracking-tight mt-5">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 mt-6">
          <div className="bg-white border border-black/[0.06] rounded-md overflow-hidden min-w-0">
            <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-[15px] font-semibold">Leads</h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Manage leads and proposals
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {["all", "approved", "draft", "sent"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`h-9 px-4 rounded-md text-sm font-medium capitalize transition-all ${
                      filter === item
                        ? "bg-black text-white"
                        : "bg-[#f7f7f8] border border-black/[0.06] text-zinc-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-[#fafafa] border-b border-black/[0.06]">
                  <tr>
                    {["Lead", "Status", "Score", "Quality", "Actions"].map(
                      (item) => (
                        <th
                          key={item}
                          className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wide"
                        >
                          {item}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead: any, index: number) => {
                    const proposalStatus = lead.proposal_status || "Draft";

                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{
                          opacity: 0,
                          y: 4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.01,
                        }}
                        onClick={() => setSelectedLead(lead)}
                        className="border-b border-black/[0.05] hover:bg-[#fafafa] transition-all cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                              {getInitials(lead.name)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold">
                                {lead.name}
                              </h3>

                              <div className="flex items-center gap-2 mt-2 text-zinc-500">
                                <Mail className="w-4 h-4 shrink-0" />

                                <p className="text-sm truncate">{lead.email}</p>
                              </div>

                              <p className="text-sm text-zinc-500 leading-7 mt-3 max-w-[520px] line-clamp-2">
                                {lead.message}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div
                            className={`h-8 px-3 rounded-md border text-xs font-medium flex items-center w-fit ${getStatusStyle(
                              proposalStatus,
                            )}`}
                          >
                            {proposalStatus}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium">
                            {lead.lead_score || 0}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-zinc-600">
                            {lead.lead_quality || "N/A"}
                          </p>
                        </td>

                        <td
                          className="px-6 py-5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            {proposalStatus === "Draft" ? (
                              <button
                                onClick={async () => {
                                  await approveProposal(lead.id);

                                  mutate();
                                }}
                                className="h-9 px-4 rounded-md bg-black text-white text-sm font-medium"
                              >
                                Approve
                              </button>
                            ) : (
                              <div
                                className={`h-9 px-4 rounded-md border text-sm font-medium flex items-center ${getStatusStyle(
                                  proposalStatus,
                                )}`}
                              >
                                {proposalStatus}
                              </div>
                            )}

                            <button
                              onClick={async () => {
                                await deleteLead(lead.id);

                                mutate();
                              }}
                              className="h-9 w-9 rounded-md border border-black/[0.06] flex items-center justify-center hover:bg-zinc-100"
                            >
                              <Trash2 className="w-4 h-4 text-zinc-600" />
                            </button>

                            <div className="h-9 w-9 rounded-md bg-[#f7f7f8] flex items-center justify-center">
                              <ChevronRight className="w-4 h-4 text-zinc-500" />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <div className="bg-white border border-black/[0.06] rounded-md p-6">
              <div className="mb-6">
                <h2 className="text-[15px] font-semibold">
                  Proposal Analytics
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Distribution overview
                </p>
              </div>

              <div className="h-[220px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={88}
                      paddingAngle={4}
                    >
                      {chartData.map((item, index) => (
                        <Cell key={index} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 mt-4">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />

                      <p className="text-sm text-zinc-600">{item.name}</p>
                    </div>

                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-md overflow-hidden">
              <div className="px-6 py-5 border-b border-black/[0.06]">
                <h2 className="text-[15px] font-semibold">Pipeline</h2>
              </div>

              <div className="divide-y divide-black/[0.06]">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="px-6 py-5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm text-zinc-500">{item.name}</p>

                      <h3 className="text-xl font-semibold mt-2">
                        {item.value}
                      </h3>
                    </div>

                    <div
                      className="w-10 h-10 rounded-md"
                      style={{
                        backgroundColor: `${item.color}20`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
