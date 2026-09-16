import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { recruiterApi } from "../services/recruiterApi";
import { FaBriefcase, FaUserCheck, FaCalendarAlt, FaAward, FaBuilding, FaFilter, FaLayerGroup, FaPlus } from "react-icons/fa";

export default function RecruiterDashboard() {
  // Read stored user safely before state initializations
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return { name: "Corporate Recruiter" };
    }
  })();

  // Core Data States
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'overview' | 'my-jobs' | 'applications'
  const [activeTab, setActiveTab] = useState("overview");

  // Selection & Modal States
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    link: "https://meet.google.com/abc-defg-hij",
  });

  // JNF Modal State
  const [showJNFModal, setShowJNFModal] = useState(false);
  const [jnfForm, setJnfForm] = useState({
    company: user?.company || "",
    title: "",
    domain: "",
    ctcPackage: "6 - 10 LPA",
    minAssessmentScore: 75,
    minCgpa: 6.5,
    eligibleBranches: "Computer Engineering, IT, AI & Data Science, B.Com, BBA",
    requiredSkills: "Data Analysis, Communication, Problem Solving",
    description: "",
  });

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    company: user?.company || "",
    phone: user?.phone || "",
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByScore, setSortByScore] = useState("none");
  const [verificationStatus, setVerificationStatus] = useState(user?.verificationStatus || "approved");

  // Fetch Dashboard Summary, Jobs, and Applications
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [dashRes, jobsRes, appRes] = await Promise.all([
        recruiterApi.getDashboard().catch(() => null),
        recruiterApi.getJobs().catch(() => null),
        recruiterApi.getApplications(selectedJobFilter).catch(() => null),
      ]);

      if (dashRes?.verificationStatus || dashRes?.data?.verificationStatus) {
        setVerificationStatus(dashRes.verificationStatus || dashRes.data.verificationStatus);
      }
      if (dashRes?.stats || dashRes?.data?.stats) {
        setStats(dashRes.stats || dashRes.data.stats);
      }
      if (jobsRes?.success && Array.isArray(jobsRes.jobs)) {
        setJobs(jobsRes.jobs);
      } else if (dashRes?.data?.jobs) {
        setJobs(dashRes.data.jobs);
      }
      if (appRes?.success && Array.isArray(appRes.applications)) {
        setApplications(appRes.applications);
      } else if (dashRes?.data?.recentApplications) {
        setApplications(dashRes.data.recentApplications);
      }
    } catch (err) {
      console.error("Recruiter dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedJobFilter]);

  // Profile update handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await recruiterApi.updateProfile(profileForm);
      if (res?.success) {
        alert("✅ Company profile updated successfully!");
        setShowProfileModal(false);
        const updatedUser = { ...user, ...res.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      alert(`❌ Failed to update profile: ${err.message}`);
    }
  };

  // Status Updater with Sync
  const updateStatus = async (appId, newStatus, extraData = {}) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status: newStatus, ...extraData } : app))
    );

    if (selectedCandidate && selectedCandidate._id === appId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus, ...extraData }));
    }

    try {
      await recruiterApi.updateStatus(appId, { status: newStatus, ...extraData });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update candidate status:", err);
    }
  };

  // Close/Reopen job drive
  const handleToggleJob = async (jobId) => {
    try {
      const res = await recruiterApi.closeJob(jobId);
      if (res?.success) {
        alert(`✅ ${res.message}`);
        fetchDashboardData();
      }
    } catch (err) {
      alert(`❌ Failed to update job drive status: ${err.message}`);
    }
  };

  // Schedule Interview Submit
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) return;

    await updateStatus(selectedAppId, "Interview Scheduled", {
      interviewDate: interviewDetails.date,
      interviewTime: interviewDetails.time,
      interviewLink: interviewDetails.link,
    });

    alert("📅 Interview scheduled successfully and candidate notified!");
    setShowInterviewModal(false);
    setSelectedAppId(null);
  };

  // JNF Form Submit
  const handleJnfSubmit = async (e) => {
    e.preventDefault();
    if (verificationStatus !== "approved") {
      alert("⚠️ Your recruiter account is pending administrator approval before you can publish JNF drives.");
      return;
    }
    try {
      const res = await recruiterApi.postJob(jnfForm);
      if (res?.success) {
        alert("✅ JNF placement drive successfully published and broadcast to students!");
        setShowJNFModal(false);
        setJnfForm({
          company: user?.company || "",
          title: "",
          domain: "",
          ctcPackage: "6 - 10 LPA",
          minAssessmentScore: 75,
          minCgpa: 6.5,
          eligibleBranches: "Computer Engineering, IT, AI & Data Science, B.Com, BBA",
          requiredSkills: "Data Analysis, Communication, Problem Solving",
          description: "",
        });
        fetchDashboardData();
      }
    } catch (err) {
      alert(`❌ Failed to publish JNF drive: ${err.message}`);
    }
  };

  // Filtered Applications for Applications Tab
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesQuery =
          (app.applicantName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.applicantEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.skills && app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesStatus =
          statusFilter === "All" || (app.status || "").toLowerCase() === statusFilter.toLowerCase();

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortByScore === "high-to-low") return (b.careerScore || 0) - (a.careerScore || 0);
        if (sortByScore === "low-to-high") return (a.careerScore || 0) - (b.careerScore || 0);
        return 0;
      });
  }, [applications, searchQuery, statusFilter, sortByScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Verification Warning Alert */}
      {verificationStatus !== "approved" && (
        <div
          className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold ${
            verificationStatus === "rejected"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{verificationStatus === "rejected" ? "⚠️" : "⏳"}</span>
            <span>
              {verificationStatus === "rejected"
                ? "Account Verification Rejected: Your recruiter profile was not approved by Placement Cell. Publishing drives is restricted."
                : "Account Verification Pending: Your recruiter account is under review by Placement Cell Admin."}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px] font-black bg-amber-200 text-amber-900">
            {verificationStatus}
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Corporate Placement Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome, {user?.name || "Corporate Partner"} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage placement drives, candidate applications, interview schedules, and applicant rubrics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition text-xs border border-slate-700 flex items-center gap-1.5"
          >
            <FaBuilding /> Company Profile
          </button>
          <button
            onClick={() => {
              if (verificationStatus !== "approved") {
                alert("⚠️ Your recruiter account is pending administrator approval before you can publish JNF drives.");
                return;
              }
              setShowJNFModal(true);
            }}
            disabled={verificationStatus !== "approved"}
            className={`px-5 py-2.5 font-bold rounded-2xl shadow-lg transition text-xs flex items-center gap-2 ${
              verificationStatus === "approved"
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                : "bg-slate-700 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <FaPlus /> Publish New JNF Drive
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-3 text-xs font-black rounded-t-2xl border-b-2 transition flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab("my-jobs")}
          className={`px-5 py-3 text-xs font-black rounded-t-2xl border-b-2 transition flex items-center gap-2 ${
            activeTab === "my-jobs"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          💼 My Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-5 py-3 text-xs font-black rounded-t-2xl border-b-2 transition flex items-center gap-2 ${
            activeTab === "applications"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📄 Applications ({applications.length})
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Drives</span>
              <p className="text-3xl font-black text-slate-900">{stats?.totalJobs || jobs.length}</p>
              <span className="text-[10px] text-slate-500 font-semibold">Posted placement drives</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Active Drives</span>
              <p className="text-3xl font-black text-emerald-900">{stats?.activeJobs || jobs.filter(j => j.status !== 'closed' && j.status !== 'Closed').length}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Accepting submissions</span>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Closed Drives</span>
              <p className="text-3xl font-black text-slate-800">{stats?.closedJobs || jobs.filter(j => j.status === 'closed' || j.status === 'Closed').length}</p>
              <span className="text-[10px] text-slate-500 font-semibold">Completed drives</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Total Submissions</span>
              <p className="text-3xl font-black text-blue-900">{stats?.totalApplicants || applications.length}</p>
              <span className="text-[10px] text-blue-700 font-semibold">Across all owned drives</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Interviews</span>
              <p className="text-3xl font-black text-purple-900">{stats?.interviewCount || applications.filter(a => a.status === 'Interview Scheduled').length}</p>
              <span className="text-[10px] text-purple-700 font-semibold">Scheduled calls</span>
            </div>
          </div>

          {/* Status Breakdown Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Candidate Status Funnel Across All Drives</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Applied</span>
                <div className="text-2xl font-black text-slate-800 mt-1">{stats?.appliedCount || applications.filter(a => !a.status || a.status === 'Applied').length}</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-xs font-bold text-blue-600 uppercase">Shortlisted</span>
                <div className="text-2xl font-black text-blue-700 mt-1">{stats?.shortlistedCount || applications.filter(a => a.status === 'Shortlisted').length}</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-xs font-bold text-purple-600 uppercase">Interviews</span>
                <div className="text-2xl font-black text-purple-700 mt-1">{stats?.interviewCount || applications.filter(a => a.status === 'Interview Scheduled').length}</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-600 uppercase">Offers</span>
                <div className="text-2xl font-black text-amber-700 mt-1">{stats?.selectedCount || applications.filter(a => a.status === 'Offer Extended' || a.status === 'Selected').length}</div>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-600 uppercase">Rejected</span>
                <div className="text-2xl font-black text-rose-700 mt-1">{stats?.rejectedCount || applications.filter(a => a.status === 'Rejected').length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY JOBS ================= */}
      {activeTab === "my-jobs" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">All Posted Placement Drives</h2>
              <p className="text-xs text-slate-500">Every corporate drive posted under your recruiter account.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Posted Date</th>
                  <th className="py-3 px-4">Applications</th>
                  <th className="py-3 px-4">Shortlisted</th>
                  <th className="py-3 px-4">Interviews</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.length > 0 ? (
                  jobs.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{j.title}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{j.company}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            j.status === "closed" || j.status === "Closed"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {j.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "2 days ago"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">
                        {j.totalApplications !== undefined ? j.totalApplications : applications.filter(a => String(a.jobId) === String(j._id) || a.jobTitle === j.title).length}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {j.shortlistedCount !== undefined ? j.shortlistedCount : applications.filter(a => (String(a.jobId) === String(j._id) || a.jobTitle === j.title) && a.status === 'Shortlisted').length}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-purple-600">
                        {j.interviewCount !== undefined ? j.interviewCount : applications.filter(a => (String(a.jobId) === String(j._id) || a.jobTitle === j.title) && a.status === 'Interview Scheduled').length}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedJobFilter(j._id);
                              setActiveTab("applications");
                            }}
                            className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-xs transition"
                          >
                            Manage Applicants
                          </button>
                          <button
                            onClick={() => handleToggleJob(j._id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                          >
                            {j.status === "closed" || j.status === "Closed" ? "Reopen" : "Close"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                      No jobs published under this recruiter account yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: APPLICATIONS ================= */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          {/* Controls Bar: Search + Job Filter Dropdown */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by candidate name, email, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500"
              />
            </div>

            {/* JOB FILTER DROPDOWN */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <FaFilter className="text-slate-400 text-xs" />
                <span className="text-xs font-bold text-slate-600">Filter by Job Drive:</span>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-black text-slate-800 bg-white focus:outline-blue-500"
                >
                  <option value="all">🌐 All Jobs ({jobs.length} drives)</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortByScore}
                onChange={(e) => setSortByScore(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
              >
                <option value="none">Sort: Default</option>
                <option value="high-to-low">AI Match: Highest → Lowest</option>
                <option value="low-to-high">AI Match: Lowest → Highest</option>
              </select>
            </div>
          </div>

          {/* STATUS FILTER BAR */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {["All", "Applied", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* APPLICATIONS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Job</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">AI Match</th>
                  <th className="py-3 px-4">ATS Resume</th>
                  <th className="py-3 px-4">Skills Matrix</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{app.jobTitle}</p>
                        <p className="text-[10px] text-slate-400">{app.companyName || app.company}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {typeof app.careerScore === "number" ? `${app.careerScore}%` : app.matchScore || "Not available"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px]">
                          {app.atsScore || "Not available"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.skills?.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === "Shortlisted"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : app.status === "Interview Scheduled"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : app.status === "Offer Extended" || app.status === "Selected"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {app.status || "Applied"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              setSelectedCandidate(app);
                              setShowCandidateModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => updateStatus(app._id, "Shortlisted")}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-100 transition"
                          >
                            Shortlist
                          </button>

                          <button
                            onClick={() => {
                              setSelectedAppId(app._id);
                              setShowInterviewModal(true);
                            }}
                            className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold hover:bg-purple-100 transition"
                          >
                            Schedule
                          </button>

                          <button
                            onClick={() => updateStatus(app._id, "Offer Extended")}
                            className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition"
                          >
                            Offer
                          </button>

                          <button
                            onClick={() => updateStatus(app._id, "Rejected")}
                            className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-100 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                      {loading ? "Loading candidate applications..." : "No candidate applications match the selected job drive & status criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANDIDATE INSPECTION MODAL */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Candidate Rubric Inspection</h2>
                <p className="mt-1 text-xs text-slate-500">Applicant details, AI Match score & ATS resume analysis</p>
              </div>
              <button
                onClick={() => {
                  setShowCandidateModal(false);
                  setSelectedCandidate(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white">
                  {selectedCandidate.applicantName ? selectedCandidate.applicantName.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedCandidate.applicantName}</h3>
                  <p className="text-sm text-slate-500">{selectedCandidate.applicantEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">AI Match Score</p>
                  <p className="mt-1 text-2xl font-black text-blue-600">{selectedCandidate.careerScore || selectedCandidate.matchScore || 0}%</p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500">ATS Resume Score</p>
                  <p className="mt-1 text-2xl font-black text-purple-600">{selectedCandidate.atsScore || "Not available"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="text-sm font-black text-slate-900">Application Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Applied Job</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Company</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.companyName || selectedCandidate.company}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Education</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.education || "Undergraduate"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Matched Domain</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.matchedCareer || "General Role"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-black text-slate-900">Skills Matrix</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                    selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="rounded-xl bg-slate-100 border border-slate-200/80 px-3 py-1 text-xs font-bold text-slate-700">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No skills provided.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => updateStatus(selectedCandidate._id, "Shortlisted")}
                  className="rounded-xl bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => {
                    setSelectedAppId(selectedCandidate._id);
                    setShowCandidateModal(false);
                    setShowInterviewModal(true);
                  }}
                  className="rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => updateStatus(selectedCandidate._id, "Offer Extended")}
                  className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                >
                  Offer
                </button>
                <button
                  onClick={() => updateStatus(selectedCandidate._id, "Rejected")}
                  className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW SCHEDULING MODAL */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Schedule Technical Interview</h3>
              <button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Interview Date *</label>
                <input
                  type="date"
                  required
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Interview Time *</label>
                <input
                  type="time"
                  required
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Meeting Link *</label>
                <input
                  type="url"
                  required
                  value={interviewDetails.link}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, link: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700">
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JNF CREATION MODAL */}
      {showJNFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Job Notification Form (JNF)</h3>
                <p className="text-xs text-slate-500">Publish recruitment drive requirements & cutoffs</p>
              </div>
              <button onClick={() => setShowJNFModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleJnfSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, TCS"
                  value={jnfForm.company}
                  onChange={(e) => setJnfForm({ ...jnfForm, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Job Title / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Analyst, Software Engineer"
                  value={jnfForm.title}
                  onChange={(e) => setJnfForm({ ...jnfForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Career Domain *</label>
                <select
                  value={jnfForm.domain}
                  onChange={(e) => setJnfForm({ ...jnfForm, domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Software Development / IT">Software Development / IT</option>
                  <option value="Data Analytics & Data Science">Data Analytics & Data Science</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Finance & Banking">Finance & Banking</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Marketing & Digital Marketing">Marketing & Digital Marketing</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Business / Management">Business / Management</option>
                  <option value="UI/UX & Graphic Design">UI/UX & Graphic Design</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education / Teaching">Education / Teaching</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Media & Content">Media & Content</option>
                  <option value="Other / Emerging Careers">Other / Emerging Careers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">CTC Package</label>
                  <input
                    type="text"
                    value={jnfForm.ctcPackage}
                    onChange={(e) => setJnfForm({ ...jnfForm, ctcPackage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Min Assessment Score %</label>
                  <input
                    type="number"
                    value={jnfForm.minAssessmentScore}
                    onChange={(e) => setJnfForm({ ...jnfForm, minAssessmentScore: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Required Competencies / Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, Machine Learning"
                  value={jnfForm.requiredSkills}
                  onChange={(e) => setJnfForm({ ...jnfForm, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Drive Description & Responsibilities</label>
                <textarea
                  rows={3}
                  value={jnfForm.description}
                  onChange={(e) => setJnfForm({ ...jnfForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowJNFModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">
                  Publish & Broadcast JNF Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}