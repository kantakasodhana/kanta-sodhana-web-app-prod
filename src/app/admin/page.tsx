"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
  status: "new" | "reviewed" | "resolved";
}

interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "resolved">("all");
  const [activeTab, setActiveTab] = useState<"submissions" | "users">("submissions");

  const fetchSubmissions = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from("contact_submissions").select("*").order("submitted_at", { ascending: false });

      if (!error) setSubmissions(data || []);
    } catch (err) {
      console.error("Fetch submissions error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });

      if (!error) setUsers(data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchUsers();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const subSubmissions = supabase
        .channel("contact_submissions")
        .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => fetchSubmissions())
        .subscribe();

      const subUsers = supabase
        .channel("users")
        .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => fetchUsers())
        .subscribe();

      return () => {
        subSubmissions.unsubscribe();
        subUsers.unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("contact_submissions").update({ status: newStatus }).eq("id", id);
      fetchSubmissions();
    } catch (err) {
      console.error("Update submission error:", err);
    }
  };

  const updateUserApproval = async (userId: string, approved: boolean) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("users").update({ is_approved: approved }).eq("id", userId);
      fetchUsers();
    } catch (err) {
      console.error("Update user approval error:", err);
    }
  };

  const filteredSubmissions = submissions.filter(sub => filter === "all" || sub.status === filter);
  const pendingUsers = users.filter(u => !u.is_approved);
  const approvedUsers = users.filter(u => u.is_approved);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="border-b border-[var(--border)] p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-3">Admin Suite</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-3">System Control</h1>
          <p className="text-lg text-[var(--text-muted)] font-mono">Manage personnel approvals and incoming transmissions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* Tab Navigation */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.2em] transition-all border ${
              activeTab === "users"
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--accent)]"
            }`}
          >
            Personnel Registry
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.2em] transition-all border ${
              activeTab === "submissions"
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--accent)]"
            }`}
          >
            Transmission Log
          </button>
        </div>

        {activeTab === "users" ? (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Personnel", count: users.length },
                { label: "Awaiting Clearance", count: pendingUsers.length },
                { label: "Cleared Status", count: approvedUsers.length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-[var(--accent)]">{stat.count}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-[var(--text-muted)] font-mono text-xs uppercase tracking-[0.2em]">
                Retrieving personnel files...
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pending Approvals */}
                {pendingUsers.length > 0 && (
                  <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                    <div className="bg-[var(--surface)] px-6 py-4 border-b border-[var(--border)]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1">Clearance Level</p>
                      <h3 className="text-2xl font-bold text-[var(--text)]">Pending Access Requests</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Unit ID</th>
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Contact</th>
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Phone</th>
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingUsers.map((user) => (
                            <tr key={user.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)]/50 transition">
                              <td className="px-6 py-4 font-mono text-sm text-[var(--accent)]">{user.username}</td>
                              <td className="px-6 py-4 text-sm text-[var(--text)]">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{user.email}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => updateUserApproval(user.id, true)}
                                  className="px-4 py-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[9px] uppercase tracking-[0.2em] hover:bg-[var(--accent)]/20 transition"
                                >
                                  Grant Access
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Approved Users */}
                {approvedUsers.length > 0 && (
                  <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                    <div className="bg-[var(--surface)] px-6 py-4 border-b border-[var(--border)]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1">Active Operations</p>
                      <h3 className="text-2xl font-bold text-[var(--text)]">Authorized Personnel</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Unit ID</th>
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Contact</th>
                            <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvedUsers.map((user) => (
                            <tr key={user.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)]/50 transition">
                              <td className="px-6 py-4 font-mono text-sm text-[var(--accent)]">{user.username}</td>
                              <td className="px-6 py-4 text-sm text-[var(--text)]">{user.email}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => updateUserApproval(user.id, false)}
                                  className="px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-[9px] uppercase tracking-[0.2em] hover:bg-red-500/20 transition"
                                >
                                  Revoke Access
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {pendingUsers.length === 0 && approvedUsers.length === 0 && (
                  <div className="text-center py-16 text-[var(--text-muted)] font-mono text-xs">
                    No personnel records found
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Transmissions", count: submissions.length },
                { label: "Unreviewed", count: submissions.filter((s) => s.status === "new").length },
                { label: "In Review", count: submissions.filter((s) => s.status === "reviewed").length },
                { label: "Resolved", count: submissions.filter((s) => s.status === "resolved").length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-[var(--accent)]">{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "new", "reviewed", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.2em] transition-all border ${
                    filter === f
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--accent)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-[var(--text-muted)] font-mono text-xs uppercase tracking-[0.2em]">
                Retrieving transmission log...
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)] font-mono text-xs uppercase tracking-[0.2em]">
                No transmissions in this category
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                        <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">From</th>
                        <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Email</th>
                        <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Message</th>
                        <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                        <th className="px-6 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)]/50 transition">
                          <td className="px-6 py-4 text-sm text-[var(--text)]">{submission.name}</td>
                          <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{submission.email}</td>
                          <td className="px-6 py-4 text-sm text-[var(--text)] max-w-xs truncate">{submission.message}</td>
                          <td className="px-6 py-4">
                            <select
                              value={submission.status}
                              onChange={(e) => updateSubmissionStatus(submission.id, e.target.value)}
                              className="px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] border border-[var(--border)] bg-transparent text-[var(--text)] cursor-pointer hover:border-[var(--accent)] transition"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-mono">
                            {new Date(submission.submitted_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
