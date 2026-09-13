import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../services/api";
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaUserGraduate, FaMagic, FaCheckCircle, FaClock, FaBuilding, FaFilter, FaLayerGroup } from "react-icons/fa";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [error, setError] = useState("");

  // Multi-Domain Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search");
    const domainParam = urlParams.get("domain");
    const roleParam = urlParams.get("role");
    if (searchParam) setSearchQuery(searchParam);
    if (domainParam) setSelectedDomain(domainParam);
    if (roleParam) setSelectedRole(roleParam);
  }, [location.search]);

  const studentProfile = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const storedResults = JSON.parse(localStorage.getItem("careerResult") || "{}");
      return {
        name: user.name || "Student",
        score: storedResults.score || storedResults.overallMatchScore || 85,
        targetDomain: storedResults.topDomain || "Software Development / IT",
        targetRole: storedResults.topRecommendation || user.targetRole || "Software Developer",
      };
    } catch {
      return { name: "Student", score: 85, targetDomain: "Software Development / IT", targetRole: "Software Developer" };
    }
  })();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : {};
      const token = localStorage.getItem("token") || localStorage.getItem("career_token") || user?.token;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_URL}/jobs`, { headers });
      if (res.data?.jobs) {
        setJobs(res.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.warn("Failed to load placement drives from backend:", err.message);
      setJobs([]);
      setError("Unable to load live recruitment drives from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (job) => {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : {};
    const token = localStorage.getItem("token") || localStorage.getItem("career_token") || user?.token;

    if (!token) {
      alert("Please log in as a student to submit an application.");
      return;
    }

    try {
      const payload = {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        applicantName: user.name || "Student",
        applicantEmail: user?.email,
        education: user.degree || "Undergraduate",
        skills: user.skills || job.requiredSkills || [],
        matchedCareer: job.title,
      };

      const res = await axios.post(`${API_URL}/jobs/apply`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setAppliedIds((prev) => [...prev, job._id]);
      alert(res.data?.message || "🎉 Application submitted successfully!");
    } catch (err) {
      console.error("Application error:", err);
      alert(err.response?.data?.message || "Failed to submit application.");
    }
  };

  // Unique domains, roles & locations for dropdowns
  const uniqueDomains = useMemo(() => {
    const domains = Array.from(new Set(jobs.map((j) => j.domain).filter(Boolean)));
    return ["all", ...domains];
  }, [jobs]);

  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(jobs.map((j) => j.title).filter(Boolean)));
    return ["all", ...roles];
  }, [jobs]);

  const uniqueLocations = useMemo(() => {
    const locs = Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)));
    return ["all", ...locs];
  }, [jobs]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          (job.title || "").toLowerCase().includes(query) ||
          (job.company || "").toLowerCase().includes(query) ||
          (job.domain || "").toLowerCase().includes(query) ||
          (job.requiredSkills && job.requiredSkills.some((s) => s.toLowerCase().includes(query))) ||
          (job.description || "").toLowerCase().includes(query);

        const matchesDomain = selectedDomain === "all" || (job.domain || "").toLowerCase().includes(selectedDomain.toLowerCase());
        const matchesRole = selectedRole === "all" || job.title === selectedRole;
        const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
        const matchesWorkMode = selectedWorkMode === "all" || (job.workMode || "").toLowerCase().includes(selectedWorkMode.toLowerCase());

        return matchesSearch && matchesDomain && matchesRole && matchesLocation && matchesWorkMode;
      })
      .sort((a, b) => {
        if (sortBy === "matchScore") return (b.matchScore || 0) - (a.matchScore || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [jobs, searchQuery, selectedDomain, selectedRole, selectedLocation, selectedWorkMode, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
            <FaBuilding /> Multi-Domain Placement Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">
            Campus Placement & Career Drives
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Explore verified multi-domain opportunities across IT, Data, Finance, Marketing, HR, Accounting, Design, Operations, and emerging fields.
          </p>
        </div>

        {/* Career Target Banner */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center font-black text-indigo-300 text-xl shadow-inner">
            {studentProfile.score}%
          </div>
          <div>
            <p className="text-xs font-bold text-white">Target Career Path</p>
            <p className="text-xs text-blue-300 font-bold">{studentProfile.targetRole}</p>
            <p className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
              <FaCheckCircle className="text-emerald-400" /> {studentProfile.targetDomain}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH AND MULTI-DOMAIN FILTER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, company, domain (e.g. Data, Marketing, HR, Finance), or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-blue-500 shadow-xs"
            />
          </div>

          {/* Multi-Domain Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              <option value="all">All Career Domains</option>
              {uniqueDomains.filter((d) => d !== "all").map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              <option value="all">All Career Roles</option>
              {uniqueRoles.filter((r) => r !== "all").map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.filter((l) => l !== "all").map((l, idx) => (
                <option key={idx} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="matchScore">Sort: Highest AI Match %</option>
            </select>
          </div>
        </div>
      </div>

      {/* JOBS PORTAL GRID */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading approved corporate placement drives...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
            💼
          </div>
          <h3 className="text-base font-black text-slate-800">
            {error ? "Unable to Load Job Drives" : "No Active Drives Match Your Filters"}
          </h3>
          <p className="text-xs text-slate-500">
            {error || "No matching approved recruitment drives match your filter choices. Try broadening your criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const hasApplied = appliedIds.includes(job._id);
            const applicantCount = job.applicantCount || 0;
            const matchScore = job.matchScore !== null ? job.matchScore : null;

            return (
              <div
                key={job._id}
                className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Row: Company & Domain */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-600">{job.company}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex-shrink-0">
                      {job.jobType || "Full-time"}
                    </span>
                  </div>

                  {/* Domain Tag & Match Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100 flex items-center gap-1">
                      <FaLayerGroup className="text-blue-500" /> {job.domain || "Software Development / IT"}
                    </span>
                    {matchScore !== null && (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {matchScore}% AI Match
                      </span>
                    )}
                  </div>

                  {/* Details Quick Bar */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-slate-400" /> {job.location || "Mumbai"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">CTC / Salary</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <FaDollarSign className="text-emerald-500" /> {job.ctcPackage || job.salary || "₹10-14 LPA"}
                      </span>
                    </div>
                  </div>

                  {/* Applicants & Posted Time */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-b border-slate-100 py-2">
                    <span className="flex items-center gap-1">
                      <FaBriefcase className="text-slate-400" /> {applicantCount} applicant{applicantCount !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-slate-400" /> Posted {job.createdAt ? `${Math.max(1, Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24)))}d ago` : "recently"}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Required Competencies */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills && job.requiredSkills.length > 0 ? (
                        job.requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Standard competencies</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <Link to={`/jobs/${job._id}`} className="flex-1">
                    <button className="w-full py-2.5 rounded-2xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                      View Details
                    </button>
                  </Link>

                  <button
                    onClick={() => handleApply(job)}
                    disabled={hasApplied}
                    className={`flex-1 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition ${
                      hasApplied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                    }`}
                  >
                    {hasApplied ? "✓ Applied" : "Apply Now →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}