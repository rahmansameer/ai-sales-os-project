"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Mail, Trash2, Search } from "lucide-react";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    body: JSON.stringify({
      id,
    }),
  });
}

async function deleteLead(id: string) {
  await fetch("/api/delete-lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });
}

export default function DashboardClient() {
  const { data: leads = [], mutate } = useSWR("/api/leads", fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: true,
  });

  console.log(leads);

  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const approvedCount = leads.filter(
    (lead: any) => lead.proposal_status === "Approved",
  ).length;

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.message?.toLowerCase().includes(search.toLowerCase());

    if (filter === "approved") {
      return matchesSearch && lead.proposal_status === "Approved";
    }

    if (filter === "draft") {
      return matchesSearch && lead.proposal_status !== "Approved";
    }

    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black">
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="sm:max-w-2xl rounded-xl border-0 p-0 overflow-hidden">
          {selectedLead && (
            <div className="bg-white">
              <DialogHeader className="px-8 pt-8 pb-6 border-b border-black/[0.06]">
                <DialogTitle className="text-[22px] font-semibold tracking-tight">
                  {selectedLead.name}
                </DialogTitle>

                <p className="text-sm text-zinc-500 mt-2">
                  {selectedLead.email}
                </p>
              </DialogHeader>

              <div className="p-8 space-y-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs text-zinc-700">
                    {selectedLead.status}
                  </div>

                  <div className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs text-zinc-700">
                    Score {selectedLead.lead_score || 0}
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-md text-xs ${
                      selectedLead.proposal_status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedLead.proposal_status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-black/[0.06] rounded-xl p-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wide">
                      Lead Quality
                    </p>

                    <h3 className="mt-2 text-sm font-semibold">
                      {selectedLead.lead_quality || "N/A"}
                    </h3>
                  </div>

                  <div className="border border-black/[0.06] rounded-xl p-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wide">
                      Urgency
                    </p>

                    <h3 className="mt-2 text-sm font-semibold">
                      {selectedLead.urgency || "N/A"}
                    </h3>
                  </div>

                  <div className="border border-black/[0.06] rounded-xl p-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wide">
                      Buyer Intent
                    </p>

                    <h3 className="mt-2 text-sm font-semibold">
                      {selectedLead.buyer_intent || "N/A"}
                    </h3>
                  </div>

                  <div className="border border-black/[0.06] rounded-xl p-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wide">
                      Project Size
                    </p>

                    <h3 className="mt-2 text-sm font-semibold">
                      {selectedLead.project_size || "N/A"}
                    </h3>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 mb-3">
                    AI Analysis
                  </p>

                  <div className="border border-black/[0.06] rounded-xl p-5">
                    <p className="text-[15px] leading-7 text-zinc-700">
                      {selectedLead.ai_reason || "No AI analysis available"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 mb-3">
                    Client Message
                  </p>

                  <div className="border border-black/[0.06] rounded-xl p-5">
                    <p className="text-[15px] leading-7 text-zinc-700">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <header className="h-16 border-b border-black/[0.05] bg-white">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <h1 className="text-[17px] font-semibold tracking-tight">
            Dashboard
          </h1>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />

            <p className="text-sm text-zinc-500">System Active</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-black/[0.05] rounded-xl p-6">
            <p className="text-sm text-zinc-500">Total Leads</p>

            <h2 className="text-4xl font-semibold tracking-tight mt-3">
              {leads.length}
            </h2>
          </div>

          <div className="bg-white border border-black/[0.05] rounded-xl p-6">
            <p className="text-sm text-zinc-500">Approved</p>

            <h2 className="text-4xl font-semibold tracking-tight mt-3">
              {approvedCount}
            </h2>
          </div>

          <div className="bg-white border border-black/[0.05] rounded-xl p-6">
            <p className="text-sm text-zinc-500">Automation</p>

            <h2 className="text-4xl font-semibold tracking-tight mt-3">Live</h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full h-11 bg-white border border-black/[0.06] rounded-lg pl-10 pr-4 text-sm outline-none focus:border-black/[0.12]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`h-10 px-4 rounded-lg text-sm transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-black text-white"
                  : "bg-white border border-black/[0.06]"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`h-10 px-4 rounded-lg text-sm transition-all cursor-pointer ${
                filter === "approved"
                  ? "bg-black text-white"
                  : "bg-white border border-black/[0.06]"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("draft")}
              className={`h-10 px-4 rounded-lg text-sm transition-all cursor-pointer ${
                filter === "draft"
                  ? "bg-black text-white"
                  : "bg-white border border-black/[0.06]"
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLeads.map((lead: any, index: number) => {
            const approved = lead.proposal_status === "Approved";

            return (
              <motion.div
                key={lead.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.03,
                }}
                onClick={() => setSelectedLead(lead)}
                className="bg-white border border-black/[0.05] rounded-xl px-6 py-5 cursor-pointer hover:border-black/[0.08] transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[17px] font-semibold tracking-tight">
                        {lead.name}
                      </h2>

                      <div className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs text-zinc-600">
                        {lead.status}
                      </div>

                      <div className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs text-zinc-600">
                        Score {lead.lead_score || 0}
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded-md text-xs ${
                          approved
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {approved ? "Approved" : "Draft"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-zinc-500">
                      <Mail className="w-4 h-4 shrink-0" />

                      <p className="text-sm truncate">{lead.email}</p>
                    </div>

                    <p className="mt-5 text-[15px] text-zinc-700 leading-7 max-w-4xl">
                      {lead.message}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {approved ? (
                      <div className="h-10 px-5 rounded-md bg-green-600 text-white text-sm font-medium flex items-center">
                        Approved
                      </div>
                    ) : (
                      <button
                        onClick={async () => {
                          await approveProposal(lead.id);

                          mutate();
                        }}
                        className="h-10 px-5 rounded-md bg-black text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        await deleteLead(lead.id);

                        mutate();
                      }}
                      className="h-10 w-10 rounded-md border border-black/[0.08] flex items-center justify-center hover:bg-zinc-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-zinc-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
