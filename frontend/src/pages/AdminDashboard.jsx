import { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab State: 'overview' | 'recruiters' | 'students' | 'jobs' | 'applications' | 'analytics' | 'announcements'
  const [activeTab, setActiveTab] = useState("overview");

  // Filters & Search
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [recruiterSearch, setRecruiterSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [appSearch, setAppSearch] = useState("");

  // Announcements form
  const [announcement, setAnnouncement] = useState({
    targetGroup: "students", // 'students' | 'recruiters' | 'all'
    title: "",
    message: "",
  });

  const [actionMessage, setActionMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, recruitersRes, studentsRes, jobsRes, appsRes, analyticsRes] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getRecruiters().catch(() => null),
        adminApi.getStudents().catch(() => null),
        adminApi.getJobs().catch(() => null),
        adminApi.getApplications().catch(() => null),
        adminApi.getAnalytics().catch(() => null),
      ]);

      if (statsRes?.success) setStats(statsRes.stats);
      if (recruitersRes?.success) setRecruiters(recruitersRes.recruiters || []);
      if (studentsRes?.success) setStudents(studentsRes.students || []);
      if (jobsRes?.success) setJobs(jobsRes.jobs || []);
      if (appsRes?.success) setApplications(appsRes.applications || []);
      if (analyticsRes?.success) setAnalytics(analyticsRes.analytics);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // 1. Recruiter Verification
  const handleVerifyRecruiter = async (recruiterId, status) => {
    try {
      setActionLoading(recruiterId);
      const res = await adminApi.verifyRecruiter(recruiterId, status);
      if (res?.success) {
        showToast("success", `Recruiter status set to '${status}'`);
        setRecruiters((prev) =>
          prev.map((r) => (r._id === recruiterId ? { ...r, verificationStatus: status } : r))
        );
        fetchAdminData();
      }
    } catch (err) {
      showToast("error", err.message || "Failed to update recruiter.");
    } finally {
      setActionLoading(null);
    }
  };

  // 2. Student Deletion
  const handleDeleteStudent = async (studentId, email) => {
    if (!window.confirm(`Are you sure you want to remove student record for ${email}?`)) return;
    try {
      setActionLoading(studentId);
      const res = await adminApi.deleteStudent(studentId);
      if (res?.success) {
        showToast("success", `Student ${email} removed.`);
        setStudents((prev) => prev.filter((s) => s._id !== studentId));
        fetchAdminData();
      }
    } catch (err) {
      showToast("error", err.message || "Failed to remove student.");
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Job Status Toggle & Delete
  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === "closed" ? "Active" : "closed";
    try {
      setActionLoading(jobId);
      const res = await adminApi.toggleJobStatus(jobId, nextStatus);
      if (res?.success) {
        showToast("success", `Job status set to '${nextStatus}'`);
        setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, status: nextStatus } : j)));
      }
    } catch (err) {
      showToast("error", err.message || "Failed to toggle job status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete job drive "${title}"?`)) return;
    try {
      setActionLoading(jobId);
      const res = await adminApi.deleteJob(jobId);
      if (res?.success) {
        showToast("success", `Job "${title}" deleted.`);
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      showToast("error", err.message || "Failed to delete job.");
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Send Announcement
  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.title || !announcement.message) return;
    try {
      setActionLoading("announcement");
      const res = await adminApi.sendAnnouncement(announcement);
      if (res?.success) {
        showToast("success", res.message || "Announcement broadcasted successfully!");
        setAnnouncement({ targetGroup: "students", title: "", message: "" });
      }
    } catch (err) {
      showToast("error", err.message || "Failed to broadcast announcement.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingRecruiterCount = stats?.pendingRecruiters || 0;

  // Filtered lists
  const filteredRecruiters = recruiters.filter((r) => {
    const matchStatus =
      recruiterFilter === "all" ||
      (r.verificationStatus || "pending").toLowerCase() === recruiterFilter.toLowerCase();
    const matchSearch =
      (r.name || "").toLowerCase().includes(recruiterSearch.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(recruiterSearch.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(recruiterSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredStudents = students.filter((s) => {
    return (
      (s.name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.targetRole || "").toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  const filteredJobs = jobs.filter((j) => {
    return (
      (j.title || "").toLowerCase().includes(jobSearch.toLowerCase()) ||
      (j.company || "").toLowerCase().includes(jobSearch.toLowerCase())
    );
  });

  const filteredApplications = applications.filter((a) => {
    const matchStatus = appStatusFilter === "all" || a.status === appStatusFilter;
    const matchSearch =
      (a.applicantName || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.applicantEmail || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.jobTitle || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.companyName || a.company || "").toLowerCase().includes(appSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
            PLACEMENT CELL CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Admin Dashboard 👑</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time management for students, recruiters, campus placement drives, and announcements.
          </p>
        </div>

        {pendingRecruiterCount > 0 && (
          <button
            onClick={() => {
              setActiveTab("recruiters");
              setRecruiterFilter("pending");
            }}
            className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition"
          >
            <span className="text-base">⏳</span>
            <span>{pendingRecruiterCount} Recruiter(s) Pending Review</span>
          </button>
        )}
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border transition shadow-sm ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {actionMessage.type === "success" ? "✅ " : "⚠️ "}
          {actionMessage.text}
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "recruiters", label: `🏢 Recruiters (${recruiters.length})` },
          { id: "students", label: `🎓 Students (${students.length})` },
          { id: "jobs", label: `💼 Drives (${jobs.length})` },
          { id: "applications", label: `📄 Applications (${applications.length})` },
          { id: "analytics", label: "📈 Analytics" },
          { id: "announcements", label: "📢 Announcements" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-black rounded-xl transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
              <h2 className="text-2xl font-black text-slate-900">{stats?.totalStudents || 0}</h2>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Recruiters</p>
              <h2 className="text-2xl font-black text-slate-900">{stats?.totalRecruiters || 0}</h2>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-1">
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Pending Recruiters</p>
              <h2 className="text-2xl font-black text-amber-900">{stats?.pendingRecruiters || 0}</h2>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Drives</p>
              <h2 className="text-2xl font-black text-slate-900">{stats?.activeJobs || 0}</h2>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applications</p>
              <h2 className="text-2xl font-black text-slate-900">{stats?.totalApplications || 0}</h2>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-1">
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Placement Rate</p>
              <h2 className="text-2xl font-black text-emerald-900">{stats?.placementRate || 0}%</h2>
            </div>
          </div>

          {/* Detailed Pipeline Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Application Pipeline</h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Applied</span>
                  <span className="font-bold text-slate-900">{stats?.applied || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-xl text-blue-900">
                  <span>Shortlisted</span>
                  <span className="font-bold">{stats?.shortlisted || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-purple-50 rounded-xl text-purple-900">
                  <span>Interview Scheduled</span>
                  <span className="font-bold">{stats?.interviewScheduled || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-xl text-emerald-900">
                  <span>Selected / Offer Extended</span>
                  <span className="font-bold">{(stats?.selected || 0) + (stats?.offers || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded-xl text-rose-900">
                  <span>Rejected</span>
                  <span className="font-bold">{stats?.rejected || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recruiter Approval Status</h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-xl text-emerald-900">
                  <span>Approved Corporate Partners</span>
                  <span className="font-bold">{stats?.approvedRecruiters || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-amber-50 rounded-xl text-amber-900">
                  <span>Pending Verification</span>
                  <span className="font-bold">{stats?.pendingRecruiters || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded-xl text-rose-900">
                  <span>Rejected Verification</span>
                  <span className="font-bold">{stats?.rejectedRecruiters || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RECRUITERS ================= */}
      {activeTab === "recruiters" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recruiter Approvals</h2>
              <p className="text-xs text-slate-500">Manage recruiter corporate access to campus placement drives.</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search recruiter or company..."
                value={recruiterSearch}
                onChange={(e) => setRecruiterSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500 flex-1 sm:w-60"
              />
              <div className="flex gap-1">
                {["all", "pending", "approved", "rejected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRecruiterFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      recruiterFilter === filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Recruiter</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((r) => {
                    const st = r.verificationStatus || "pending";
                    return (
                      <tr key={r._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{r.name || "Unnamed"}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{r.company || "Not specified"}</td>
                        <td className="py-3.5 px-4 text-slate-600">{r.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{r.phone || "—"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              st === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : st === "rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {st}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {st !== "approved" && (
                              <button
                                disabled={actionLoading === r._id}
                                onClick={() => handleVerifyRecruiter(r._id, "approved")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            {st !== "rejected" && (
                              <button
                                disabled={actionLoading === r._id}
                                onClick={() => handleVerifyRecruiter(r._id, "rejected")}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition disabled:opacity-50"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400 font-medium">
                      No recruiters found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STUDENTS ================= */}
      {activeTab === "students" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Directory</h2>
              <p className="text-xs text-slate-500">View student readiness scores, education, skills, and placement records.</p>
            </div>
            <input
              type="text"
              placeholder="Search by student name, email, or role..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500 w-full sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Education</th>
                  <th className="py-3 px-4">Target Career</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Applications</th>
                  <th className="py-3 px-4">Placement Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {s.name}
                        <span className="block text-[11px] font-normal text-slate-400">{s.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{s.education}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600">{s.targetRole}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                          {s.readinessScore}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{s.applicationCount} drive(s)</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            s.placementStatus === "Placed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {s.placementStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          disabled={actionLoading === s._id}
                          onClick={() => handleDeleteStudent(s._id, s.email)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400 font-medium">
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: JOBS ================= */}
      {activeTab === "jobs" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Campus Recruitment Drives</h2>
              <p className="text-xs text-slate-500">Monitor active and closed placement job postings.</p>
            </div>
            <input
              type="text"
              placeholder="Search job title or company..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500 w-full sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Job Role / Drive</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Cutoff Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{j.title}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{j.company}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{j.ctcPackage || "₹10-14 LPA"}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">{j.minAssessmentScore || 75}%</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            j.status === "closed"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {j.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleJobStatus(j._id, j.status)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                          >
                            {j.status === "closed" ? "Reopen" : "Close"}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(j._id, j.title)}
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400 font-medium">
                      No recruitment drives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: APPLICATIONS ================= */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Placement Applications Monitor</h2>
              <p className="text-xs text-slate-500">Live application audit across all campus recruitment drives.</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search candidate, job or company..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500 flex-1 sm:w-60"
              />
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Readiness Score</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {app.applicantName || "Student"}
                        <span className="block text-[11px] font-normal text-slate-400">{app.applicantEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{app.jobTitle}</td>
                      <td className="py-3.5 px-4 text-slate-700">{app.companyName || app.company || "—"}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{app.careerScore || 75}%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {app.status || "Applied"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                      No applications recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ANALYTICS ================= */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Placement Intelligence & Analytics</h2>
            <p className="text-xs text-slate-500">Calculated directly from live MongoDB Atlas documents.</p>
          </div>

          {/* AI Key Insights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-tr from-indigo-900 to-slate-900 text-white rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Average Job Match Score</span>
              <p className="text-3xl font-black text-white mt-1">{analytics?.averageMatchScore || 75}%</p>
              <p className="text-[11px] text-indigo-200 mt-1">Weighted compatibility average</p>
            </div>

            <div className="p-4 bg-gradient-to-tr from-blue-900 to-indigo-900 text-white rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Total Placement Drives</span>
              <p className="text-3xl font-black text-white mt-1">{analytics?.totalJobs || 0}</p>
              <p className="text-[11px] text-blue-200 mt-1">Live campus drives</p>
            </div>

            <div className="p-4 bg-gradient-to-tr from-purple-900 to-slate-900 text-white rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Application Volume</span>
              <p className="text-3xl font-black text-white mt-1">{analytics?.totalApplications || 0}</p>
              <p className="text-[11px] text-purple-200 mt-1">Student submissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Demanded Skills */}
            <div className="p-5 bg-slate-50 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ⚡ Top Demanded Skills Across Drives
              </h3>
              {analytics?.demandedSkills && Object.keys(analytics.demandedSkills).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(analytics.demandedSkills)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([skill, count]) => (
                      <div key={skill} className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-800 font-bold">{skill}</span>
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
                          {count} drive(s)
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No skill demand metrics calculated yet.</p>
              )}
            </div>

            {/* Career Role Demand */}
            <div className="p-5 bg-slate-50 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                🎯 Career Roles Distribution
              </h3>
              {analytics?.careerRolesDistribution && Object.keys(analytics.careerRolesDistribution).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(analytics.careerRolesDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([role, count]) => (
                      <div key={role} className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-800 font-bold">{role}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
                          {count} applicant(s)
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No career role distribution metrics calculated yet.</p>
              )}
            </div>

            {/* Application Status Breakdown */}
            <div className="p-5 bg-slate-50 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Application Status Breakdown</h3>
              {analytics?.statusBreakdown && Object.keys(analytics.statusBreakdown).length > 0 ? (
                Object.entries(analytics.statusBreakdown).map(([st, count]) => (
                  <div key={st} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700">{st}</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border text-slate-900 font-bold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No application distribution data yet.</p>
              )}
            </div>

            {/* Jobs per Company */}
            <div className="p-5 bg-slate-50 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Jobs Posted per Corporate Partner</h3>
              {analytics?.companyJobs && Object.keys(analytics.companyJobs).length > 0 ? (
                Object.entries(analytics.companyJobs).map(([comp, count]) => (
                  <div key={comp} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700">{comp}</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border text-blue-600 font-bold">{count} drive(s)</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No company job data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: ANNOUNCEMENTS ================= */}
      {activeTab === "announcements" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Broadcast Campus Announcement</h2>
            <p className="text-xs text-slate-500">Send real notification alerts to students, recruiters, or all users.</p>
          </div>

          <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Target Audience</label>
              <select
                value={announcement.targetGroup}
                onChange={(e) => setAnnouncement((prev) => ({ ...prev, targetGroup: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-blue-500"
              >
                <option value="students">🎓 All Students</option>
                <option value="recruiters">🏢 All Recruiters</option>
                <option value="all">🌐 Everyone (Students + Recruiters)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Announcement Title</label>
              <input
                type="text"
                placeholder="e.g. Placement Drive Schedule Update..."
                value={announcement.title}
                onChange={(e) => setAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Announcement Message</label>
              <textarea
                rows={4}
                placeholder="Write message details for the broadcast..."
                value={announcement.message}
                onChange={(e) => setAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading === "announcement"}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              📢 Broadcast Announcement Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
