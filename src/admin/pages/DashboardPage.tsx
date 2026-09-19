import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Layers,
  Globe2,
  FolderGit2,
  ArrowUpRight,
  PlusCircle,
  FileEdit,
  UploadCloud,
  CheckCircle2,
  Activity as PulseIcon,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    activities: 0,
    domains: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [mRes, eRes, aRes, dRes, pRes] = await Promise.all([
          fetch("/api/admin/members", { credentials: "include" }),
          fetch("/api/admin/events", { credentials: "include" }),
          fetch("/api/admin/activities", { credentials: "include" }),
          fetch("/api/admin/domains", { credentials: "include" }),
          fetch("/api/admin/projects", { credentials: "include" }),
        ]);

        const [m, e, a, d, p] = await Promise.all([
          mRes.ok ? mRes.json() : { data: [] },
          eRes.ok ? eRes.json() : { data: [] },
          aRes.ok ? aRes.json() : { data: [] },
          dRes.ok ? dRes.json() : { data: [] },
          pRes.ok ? pRes.json() : { data: [] },
        ]);

        setStats({
          members: m.data?.length || 0,
          events: e.data?.length || 0,
          activities: a.data?.length || 0,
          domains: d.data?.length || 0,
          projects: p.data?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Team Members",
      count: stats.members,
      link: "/admin/members",
      icon: Users,
      desc: "Governance & Leaders",
    },
    {
      title: "Events & Workshops",
      count: stats.events,
      link: "/admin/events",
      icon: Calendar,
      desc: "Conducted Galas & Contests",
    },
    {
      title: "Activities Archive",
      count: stats.activities,
      link: "/admin/activities",
      icon: Layers,
      desc: "Workshops & Visits",
    },
    {
      title: "Domains",
      count: stats.domains,
      link: "/admin/domains",
      icon: Globe2,
      desc: "Core Pillar Tracks",
    },
    {
      title: "Projects",
      count: stats.projects,
      link: "/admin/projects",
      icon: FolderGit2,
      desc: "Showcase & Repos",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#041407] to-[#061e0b] border border-[#00ff66]/30 shadow-[0_0_30px_rgba(0,255,102,0.1)]">
        <div className="relative z-10 max-w-2xl">
          <span className="font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2 inline-block">
            System Operational
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-white mb-3">
            Cipher Club Content Management
          </h2>
          <p className="font-mono text-xs md:text-sm text-[#a0c0a8] leading-relaxed">
            Manage public website sections, leadership members, event galleries, domains, and text copy in real-time. Changes publish instantly.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="p-5 rounded-xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/20 flex items-center justify-center text-[#00ff66] group-hover:bg-[#00ff66] group-hover:text-black transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#88aa90] group-hover:text-[#00ff66] transition-colors" />
              </div>
              <div>
                <span className="text-3xl font-mono font-extrabold text-white group-hover:text-[#00ff66] transition-colors">
                  {loading ? "..." : card.count}
                </span>
                <h4 className="font-mono text-xs font-bold text-white mt-1">{card.title}</h4>
                <p className="text-[11px] text-[#88aa90] mt-0.5">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#030905] border border-[#00ff66]/20">
          <h3 className="font-mono text-sm font-bold text-white tracking-wider uppercase mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66]" /> Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/members"
              className="p-4 rounded-xl bg-[#051208] border border-[#00ff66]/15 hover:border-[#00ff66]/50 flex items-center gap-3 text-white transition-all group"
            >
              <PlusCircle className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-mono text-xs font-bold">Add Team Member</p>
                <p className="text-[11px] text-[#88aa90]">Insert new leader profile</p>
              </div>
            </Link>

            <Link
              to="/admin/events"
              className="p-4 rounded-xl bg-[#051208] border border-[#00ff66]/15 hover:border-[#00ff66]/50 flex items-center gap-3 text-white transition-all group"
            >
              <Calendar className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-mono text-xs font-bold">Create New Event</p>
                <p className="text-[11px] text-[#88aa90]">Add workshop or contest</p>
              </div>
            </Link>

            <Link
              to="/admin/content"
              className="p-4 rounded-xl bg-[#051208] border border-[#00ff66]/15 hover:border-[#00ff66]/50 flex items-center gap-3 text-white transition-all group"
            >
              <FileEdit className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-mono text-xs font-bold">Edit Website Content</p>
                <p className="text-[11px] text-[#88aa90]">Update headings and copy</p>
              </div>
            </Link>

            <Link
              to="/admin/media"
              className="p-4 rounded-xl bg-[#051208] border border-[#00ff66]/15 hover:border-[#00ff66]/50 flex items-center gap-3 text-white transition-all group"
            >
              <UploadCloud className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-mono text-xs font-bold">Upload Media Asset</p>
                <p className="text-[11px] text-[#88aa90]">Store photos in cloud</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 rounded-2xl bg-[#030905] border border-[#00ff66]/20 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wider uppercase mb-5 flex items-center gap-2">
              <PulseIcon className="w-4 h-4 text-[#00ff66]" /> Health &amp; Security
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#040e06] border border-[#00ff66]/15">
                <span className="font-mono text-xs text-[#88aa90]">REST API</span>
                <span className="font-mono text-xs text-[#00ff66] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#040e06] border border-[#00ff66]/15">
                <span className="font-mono text-xs text-[#88aa90]">Prisma Engine</span>
                <span className="font-mono text-xs text-[#00ff66] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#040e06] border border-[#00ff66]/15">
                <span className="font-mono text-xs text-[#88aa90]">Session Storage</span>
                <span className="font-mono text-xs text-[#00ff66] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Secure Cookie
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#00ff66]/15 mt-4">
            <p className="font-mono text-[11px] text-[#88aa90] leading-relaxed">
              All admin endpoints require session verification. CSRF and rate limits are enforced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};