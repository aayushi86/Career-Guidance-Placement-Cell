import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { request } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ======================================================
// MULTI-DOMAIN OPTIONS & CONSTANTS
// ======================================================
const availableInterests = [
  "Data & Analytics", "Artificial Intelligence / ML", "Software & Web Development",
  "Finance & Investment", "Accounting & Taxation", "Digital Marketing & Brand",
  "Human Resources & People", "Business Strategy & Ops", "UI/UX & Visual Design",
  "Cybersecurity & Networks", "Cloud & Infrastructure", "Healthcare Management",
  "Education & Pedagogy", "Sales & Business Development", "Writing & Media"
];

const availableAptitudes = [
  "Numerical Reasoning", "Logical & Analytical Thinking", "Verbal & Written Communication",
  "Creative Problem Solving", "Process & Spatial Design", "People & Interpersonal Relations"
];

const availableSkills = [
  "Python", "SQL", "Excel", "Financial Modeling", "Data Analysis",
  "JavaScript", "React", "Node.js", "Tally & GST", "SEO & Analytics",
  "Social Media Strategy", "Recruitment & HR Operations", "Figma / UI Design",
  "Copywriting", "Power BI / Tableau", "AWS / Cloud", "Linux & Networking",
  "Communication", "Project Management", "Problem Solving"
];

const availableDomains = [
  "Software Development / IT", "Data Analytics & Data Science", "Artificial Intelligence & Machine Learning",
  "Cybersecurity", "Cloud & DevOps", "Finance & Banking", "Accounting",
  "Marketing & Digital Marketing", "Human Resources", "Business / Management",
  "UI/UX & Graphic Design", "Healthcare", "Education / Teaching", "Operations",
  "Sales", "Media & Content", "Other / Emerging Careers"
];

export default function CareerTest() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    interests: [],
    aptitudes: [],
    skills: [],
    education: "Undergraduate / Graduate",
    preferredWorkStyle: "Analytical",
    preferredDomain: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const resultsRef = useRef(null);
  const jobsSectionRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const toggleRoadmapStep = async (stepNumber, currentCompleted) => {
    if (!result) return;
    const updatedRoadmap = (result.roadmap || []).map((item) =>
      item.step === stepNumber ? { ...item, completed: !currentCompleted } : item
    );

    setResult((prev) => ({ ...prev, roadmap: updatedRoadmap }));

    if (result.id) {
      try {
        await request(`/career-test/${result.id}/roadmap-step`, {
          method: "PATCH",
          body: JSON.stringify({ stepNumber, completed: !currentCompleted }),
        });
      } catch (err) {
        console.error("Failed to sync roadmap status:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setJobs([]);
    setAppliedJobIds([]);

    if (formData.interests.length === 0) {
      setError("Please select at least one interest area.");
      setLoading(false);
      return;
    }

    try {
      const data = await request("/career-test", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!data.success && !data.result) {
        throw new Error(data.message || "Failed to process evaluation");
      }

      setResult(data.result);
      const fullResult = {
        ...data.result,
        targetDomain: data.result.topDomain || formData.preferredDomain || "",
        targetRole: data.result.topRecommendation || data.result.recommendedCareer || data.result.career || "",
        topDomain: data.result.topDomain,
        topCareer: data.result.topRecommendation || data.result.recommendedCareer || data.result.career,
        domainScores: data.result.domainBreakdown || [],
        careerScores: data.result.careerMatches || [],
        skills: formData.skills || [],
        interests: formData.interests || [],
        aptitudes: formData.aptitudes || [],
        workStyle: formData.preferredWorkStyle || "Analytical",
      };
      localStorage.setItem("careerResult", JSON.stringify(fullResult));

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err) {
      setError(err.message || "Server error while submitting test.");
    } finally {
      setLoading(false);
    }
  };

  const handleExploreJobs = async () => {
    const saved = JSON.parse(localStorage.getItem("careerResult"));

    if (!saved?.topRecommendation && !saved?.career) {
      showToast("Please complete Career Test first", "error");
      return;
    }

    setLoadingJobs(true);

    try {
      const targetRole = saved.topRecommendation || saved.career;
      const data = await request(
        `/jobs?role=${encodeURIComponent(targetRole)}`
      );

      if (data.success) {
        setJobs(data.jobs || []);
        setTimeout(() => {
          jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err) {
      showToast("Unable to fetch job listings at this time.", "error");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleQuickApply = async (job) => {
    setApplyingId(job._id);

    try {
      const payload = {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        applicantName: formData.name || user?.name || "Student Applicant",
        applicantEmail: formData.email || user?.email,
        education: formData.education,
        skills: formData.skills,
        matchedCareer: result?.topRecommendation || job.title,
        careerScore: result?.score || 80,
      };

      const data = await request("/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        showToast(data.message || "Could not complete application", "error");
        return;
      }

      setAppliedJobIds((prev) => [...prev, job._id]);
      showToast(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (err) {
      showToast(err.message || "Network error submitting application.", "error");
    } finally {
      setApplyingId(null);
    }
  };

  const completedStepsCount = result?.roadmap?.filter((s) => s.completed)?.length || 0;
  const totalStepsCount = result?.roadmap?.length || 4;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-slate-900 border-slate-700 text-white"
            }`}
          >
            <span>{toast.type === "error" ? "⚠️" : "🎉"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase">
            <span>✨ Multi-Domain AI Placement Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Multi-Domain Career Assessment
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Evaluate your interests, aptitude, technical competencies, and work style across IT, Data, Finance, Marketing, HR, Design, Operations, and emerging fields.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8"
        >
          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Student Name"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@example.com"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-sm font-bold text-slate-700">1. What primary areas interest you most?</label>
              <span className="text-xs font-semibold text-blue-600">
                {formData.interests.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableInterests.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleArrayItem("interests", interest)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aptitudes */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-sm font-bold text-slate-700">2. Which problem-solving strengths describe your aptitude?</label>
              <span className="text-xs font-semibold text-emerald-600">
                {formData.aptitudes.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableAptitudes.map((aptitude) => {
                const selected = formData.aptitudes.includes(aptitude);
                return (
                  <button
                    type="button"
                    key={aptitude}
                    onClick={() => toggleArrayItem("aptitudes", aptitude)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {aptitude}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-sm font-bold text-slate-700">3. Select tools & competencies you possess or are learning</label>
              <span className="text-xs font-semibold text-indigo-600">
                {formData.skills.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableSkills.map((skill) => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleArrayItem("skills", skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education, Work Style & Preferred Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Academic Background</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Sc IT / B.Com / BBA / B.Tech"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Work Style</label>
              <select
                name="preferredWorkStyle"
                value={formData.preferredWorkStyle}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition cursor-pointer"
              >
                <option value="Analytical">Analytical & Research Oriented</option>
                <option value="Creative">Creative & Product Design</option>
                <option value="Collaborative">Collaborative & Team Oriented</option>
                <option value="Leadership">Leadership & Business Management</option>
                <option value="People-oriented">People & Relationship Oriented</option>
                <option value="Structured">Structured & Compliance Oriented</option>
                <option value="Independent">Autonomous & Self-Directed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Domain (Optional)</label>
              <select
                name="preferredDomain"
                value={formData.preferredDomain}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition cursor-pointer"
              >
                <option value="">Any Domain (Automated Match)</option>
                {availableDomains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Evaluating Multi-Domain Fit & Recommendations..." : "Generate AI Multi-Domain Career Report ✨"}
          </button>
        </form>

        {/* Results Container */}
        {result && (
          <div ref={resultsRef} className="space-y-10 animate-fade-in">
            {/* Highlight Card */}
            <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
                    Top Career & Domain Fit
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-5xl font-black">{result.topRecommendation || result.career}</h2>
                  </div>
                  <p className="text-blue-300 font-semibold text-sm">
                    Domain: <span className="text-white underline font-bold">{result.topDomain || "Software Development / IT"}</span>
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                    {result.reason}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-[140px]">
                  <span className="text-4xl sm:text-5xl font-black text-blue-400">{result.topDomainScore || result.score}%</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 mt-1">
                    Domain Compatibility
                  </span>
                </div>
              </div>
            </div>

            {/* Domain Breakdown Chart / Lists */}
            {result.domainBreakdown?.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Suitable Career Domains Breakdown</h3>
                  <p className="text-slate-500 text-sm">How your profile compares across top industry domains:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.domainBreakdown.slice(0, 6).map((item, index) => (
                    <div
                      key={item.domain}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">{item.domain}</span>
                        </div>
                        <span className="font-bold text-blue-600 text-sm">{item.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Career Roles */}
            {result.careerMatches?.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Recommended Placement Roles</h3>
                  <p className="text-slate-500 text-sm">Top specific career positions matched to your profile:</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.careerMatches.slice(0, 4).map((role) => (
                    <div key={role.career} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{role.career}</h4>
                        <span className="text-xs text-slate-500">{role.domain || result.topDomain}</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                        {role.score}% Fit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Learning Path */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Actionable Career Roadmap</h3>
                  <p className="text-slate-500 text-sm">
                    Structured step-by-step curriculum for {result.topRecommendation || result.career}.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 px-4 py-2 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 gap-4 mb-1">
                    <span>Readiness:</span>
                    <span>{progressPercent}% Complete</span>
                  </div>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                {result?.roadmap && result.roadmap.length > 0 ? (
                  result.roadmap.map((item, index) => {
                    const stepNumber = item.step || index + 1;
                    const isDone = !!item.completed;
                    return (
                      <div
                        key={stepNumber}
                        onClick={() => toggleRoadmapStep(stepNumber, isDone)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                          isDone
                            ? "bg-emerald-50/70 border-emerald-200"
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm transition-all ${
                            isDone
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                              : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          }`}
                        >
                          {isDone ? "✓" : stepNumber}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-base ${isDone ? "line-through text-emerald-900" : "text-slate-900"}`}>
                            {item.title || item}
                          </h4>
                          <p className={`text-sm mt-0.5 ${isDone ? "text-emerald-700/80" : "text-slate-500"}`}>
                            {item.description || "Master core concepts and build practical projects."}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-sm">Roadmap loaded.</p>
                )}
              </div>

              {/* Action Buttons: Complete Career Journey */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Next Steps in Your Career Journey
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-bold text-xs">
                  <Link
                    to="/skill-gap"
                    className="p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-2xl border border-blue-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    🎯 Analyze Skill Gap
                  </Link>
                  <Link
                    to="/career-roadmap"
                    className="p-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-2xl border border-indigo-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    🗺️ Generate Roadmap
                  </Link>
                  <Link
                    to="/resume-analyzer"
                    className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-2xl border border-purple-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    📄 Analyze Resume
                  </Link>
                  <Link
                    to="/jobs"
                    className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl border border-amber-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    💼 Find Matching Jobs
                  </Link>
                  <Link
                    to="/ai-assistant"
                    className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    🤖 Ask AI Advisor
                  </Link>
                  <Link
                    to="/interview-prep"
                    className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl border border-rose-200/80 transition text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    🎤 Interview Preparation
                  </Link>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
                  >
                    Retake Career Assessment
                  </button>
                  <button
                    type="button"
                    onClick={handleExploreJobs}
                    disabled={loadingJobs}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition disabled:opacity-60 text-xs"
                  >
                    {loadingJobs ? "Searching..." : `Load Placement Drives`}
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs Match Panel */}
            {jobs.length > 0 && (
              <div ref={jobsSectionRef} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Recommended Placement Openings</h3>
                    <p className="text-slate-500 text-sm">Matching opportunities from approved recruiters:</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                    {jobs.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs.map((job) => {
                    const isApplied = appliedJobIds.includes(job._id);
                    const isApplying = applyingId === job._id;

                    return (
                      <div
                        key={job._id}
                        className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:border-slate-200 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                              {job.jobType}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-600">{job.company}</p>
                          <p className="text-xs text-slate-500">📍 {job.location} • 💰 {job.ctcPackage || job.salary || "Best in Industry"}</p>
                          <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
                        </div>

                        <button
                          type="button"
                          disabled={isApplied || isApplying}
                          onClick={() => handleQuickApply(job)}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                            isApplied
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                          }`}
                        >
                          {isApplied ? "✓ Applied" : isApplying ? "Submitting..." : "Quick Apply"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}