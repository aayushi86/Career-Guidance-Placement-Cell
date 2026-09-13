import { useState, useEffect } from "react";
import axios from "axios";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import {
  FaFileUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBrain,
  FaChartBar,
  FaLightbulb,
  FaBriefcase,
  FaArrowUp,
  FaBullseye,
  FaMagic,
  FaFire,
  FaHistory,
} from "react-icons/fa";
import CareerRoleSelector from "../components/common/CareerRoleSelector";
import { API_URL } from "../services/api";

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetDomain, setTargetDomain] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ==========================================
  // FETCH AUDIT HISTORY & PREFILL CAREER CONTEXT
  // ==========================================
  const fetchHistory = async () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("career_token");
    if (!token) return;

    try {
      setLoadingHistory(true);
      const res = await axios.get(`${API_URL}/resumes/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.warn("Failed to load resume history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    try {
      const savedResult = JSON.parse(localStorage.getItem("careerResult") || "{}");
      const rawUser = JSON.parse(localStorage.getItem("user") || "{}");

      const initRole =
        savedResult.topRecommendation ||
        savedResult.recommendedCareer ||
        savedResult.career ||
        savedResult.targetRole ||
        rawUser.targetRole ||
        "";

      const initDomain =
        savedResult.topDomain ||
        savedResult.targetDomain ||
        rawUser.targetDomain ||
        "";

      if (initRole) setTargetRole(initRole);
      if (initDomain) setTargetDomain(initDomain);
    } catch {
      // ignore parse errors
    }

    fetchHistory();
  }, []);

  // ==========================================
  // LOAD PAST ANALYSIS
  // ==========================================
  const handleLoadPastRecord = async (id) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("career_token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/resumes/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        const record = res.data.record;
        setResult({
          ...record.analysis,
          targetRole: record.targetRole,
          detectedRole: record.detectedRole,
        });
        window.scrollTo({ top: 450, behavior: "smooth" });
      }
    } catch (err) {
      setError("Could not load selected resume record.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILE VALIDATION
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file && file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      setSelectedFile(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  // ==========================================
  // ANALYZE RESUME
  // ==========================================
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please upload your PDF resume.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("targetRole", targetRole);
    formData.append("targetDomain", targetDomain);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("career_token");

      const response = await axios.post(`${API_URL}/resumes/analyze`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.data?.success) {
        setResult({
          ...response.data.analysis,
          targetRole: response.data.targetRole,
          detectedRole:
            response.data.detectedRole || response.data.analysis?.detectedRole,
        });
        fetchHistory();
      } else {
        throw new Error(
          response.data?.message || "Failed to analyze resume."
        );
      }
    } catch (err) {
      console.error("Resume analysis error:", err.response || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return "Excellent Resume";
    if (score >= 70) return "Strong Resume";
    if (score >= 50) return "Needs Improvement";
    return "Needs Significant Improvement";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ==========================================
            PAGE HEADER
        ========================================== */}
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            AI ATS Resume Analyzer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload your resume and receive an AI-powered ATS analysis, skill
            evaluation, and career recommendations.
          </p>
        </div>

        {/* ==========================================
            ERROR BANNER
        ========================================== */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            UPLOAD CARD
        ========================================== */}
        <Card className="p-6">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <CareerRoleSelector
              selectedDomain={targetDomain}
              onSelectDomain={setTargetDomain}
              selectedRole={targetRole}
              onSelectRole={(role, domain) => {
                setTargetRole(role);
                if (domain) setTargetDomain(domain);
              }}
              labelDomain="Target Career Domain"
              labelRole="Target Career Role"
            />

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition">
                <input
                  type="file"
                  id="resumeUpload"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resumeUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaFileUpload className="text-4xl text-blue-600 mb-3" />
                  <span className="text-sm font-bold text-slate-700">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to select your PDF resume"}
                  </span>
                  <span className="text-xs text-slate-400 mt-2">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "PDF resumes up to 5MB"}
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold"
            >
              {loading
                ? "AI is analyzing your resume..."
                : "Run AI ATS Analysis"}
            </Button>
          </form>
        </Card>

        {/* ==========================================
            RESUME IMPROVEMENT AUDIT TRAIL
        ========================================== */}
        {history.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaHistory className="text-blue-600" />
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                  Analysis History & Score Tracking
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {history.length} Previous Audits
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">File</th>
                    <th className="pb-3">Target Role</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="py-3 font-semibold text-slate-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-bold text-slate-800 truncate max-w-[150px]">
                        {item.fileName}
                      </td>
                      <td className="py-3 text-slate-600 font-medium">
                        {item.targetRole}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                            item.atsScore >= 75
                              ? "bg-emerald-50 text-emerald-700"
                              : item.atsScore >= 60
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {item.atsScore}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleLoadPastRecord(item._id)}
                          className="text-blue-600 hover:text-blue-800 font-black hover:underline"
                        >
                          Load Rubric →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ==========================================
            RESULTS SECTION
        ========================================== */}
        {result && (
          <div className="space-y-6">
            {/* 1. OVERALL SCORE & EXECUTIVE SUMMARY */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    ATS Compatibility
                  </span>
                  <div className="text-5xl font-black text-blue-600 mt-2">
                    {result.atsScore ?? 0}%
                  </div>
                  <div className="text-sm font-bold text-slate-600 mt-2">
                    {result.verdict || getScoreLabel(result.atsScore)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-right">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Target Role
                    </span>
                    <div className="text-sm font-bold text-slate-700 mt-1">
                      {result.targetRole || targetRole}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Best Fit
                    </span>
                    <div className="text-sm font-bold text-slate-700 mt-1">
                      {result.detectedRole || targetRole}
                    </div>
                  </div>
                </div>
              </div>

              {result.executiveSummary && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBrain className="text-blue-600" />
                    <span className="text-xs font-bold uppercase text-blue-700">
                      AI Executive Summary
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.executiveSummary}
                  </p>
                </div>
              )}
            </Card>

            {/* 2. WHAT YOU SHOULD FIX FIRST (PRIORITY IMPROVEMENTS) */}
            {result.priorityImprovements?.length > 0 && (
              <Card className="p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <FaFire className="text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">
                      What You Should Fix First
                    </h2>
                    <p className="text-xs text-slate-500">
                      Focus on these improvements to increase your resume score.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.priorityImprovements.map((item, index) => {
                    const priority = item.priority?.toLowerCase() || "medium";
                    const priorityStyles = {
                      high: {
                        label: "HIGH PRIORITY",
                        className: "bg-red-50 border-red-200 text-red-700",
                      },
                      medium: {
                        label: "MEDIUM PRIORITY",
                        className: "bg-orange-50 border-orange-200 text-orange-700",
                      },
                      low: {
                        label: "LOW PRIORITY",
                        className: "bg-yellow-50 border-yellow-200 text-yellow-700",
                      },
                    };
                    const style =
                      priorityStyles[priority] || priorityStyles.medium;

                    return (
                      <div
                        key={index}
                        className={`border rounded-xl p-4 ${style.className}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wide">
                              {style.label}
                            </span>
                            <h3 className="text-sm font-bold mt-1">
                              {item.issue}
                            </h3>
                            <p className="text-xs mt-2 opacity-90 leading-relaxed">
                              {item.recommendation}
                            </p>
                          </div>
                          <FaArrowUp className="shrink-0 mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* 3. DETAILED RESUME SCORE */}
            {result.scoreBreakdown && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FaChartBar className="text-blue-600" />
                  <div>
                    <h2 className="text-lg font-black text-slate-800">
                      Detailed Resume Score
                    </h2>
                    <p className="text-xs text-slate-500">
                      Performance across important ATS criteria.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["ATS Parsing", result.scoreBreakdown?.atsParsing],
                    ["Keyword Match", result.scoreBreakdown?.keywordMatch],
                    ["Skills Match", result.scoreBreakdown?.skillsMatch],
                    [
                      "Experience Relevance",
                      result.scoreBreakdown?.experienceRelevance,
                    ],
                    ["Project Quality", result.scoreBreakdown?.projectQuality],
                    [
                      "Education Relevance",
                      result.scoreBreakdown?.educationRelevance,
                    ],
                    [
                      "Impact & Achievements",
                      result.scoreBreakdown?.impactAndAchievements,
                    ],
                  ].map(([label, score]) => (
                    <div
                      key={label}
                      className="border border-slate-100 rounded-xl p-4 bg-slate-50"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">
                          {label}
                        </span>
                        <span className="text-xs font-black text-blue-600">
                          {score || 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${score || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 4. SKILLS ANALYSIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  Matched Skills
                </h3>
                {result.matchedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No direct matches detected.
                  </p>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-amber-500" />
                  Missing Skills
                </h3>
                {result.missingSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600 font-semibold">
                    All major skills are present!
                  </p>
                )}
              </Card>
            </div>

            {/* 5. STRENGTHS & AREAS TO IMPROVE (WITH FALLBACKS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  Resume Strengths
                </h3>
                {result.strengths?.length > 0 ? (
                  <ul className="space-y-3">
                    {result.strengths.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-600 flex gap-2"
                      >
                        <span className="text-emerald-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">
                    No specific strengths were flagged.
                  </p>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-amber-500" />
                  Areas to Improve
                </h3>
                {result.weaknesses?.length > 0 ? (
                  <ul className="space-y-3">
                    {result.weaknesses.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-600 flex gap-2"
                      >
                        <span className="text-amber-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">
                    No critical weaknesses identified.
                  </p>
                )}
              </Card>
            </div>

            {/* 6. RECOMMENDED KEYWORDS */}
            {result.keywordSuggestions?.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaBullseye className="text-blue-600" />
                  <h3 className="font-black text-slate-800">
                    Recommended Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywordSuggestions.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* 7. LANGUAGE IMPROVEMENTS */}
            {result.weakPhrasesToReplace?.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FaMagic className="text-purple-600" />
                  <h3 className="font-black text-slate-800">
                    Improve Your Resume Language
                  </h3>
                </div>
                <div className="space-y-4">
                  {result.weakPhrasesToReplace.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <div className="mb-3">
                        <span className="text-xs font-bold text-red-500 uppercase">
                          Current / Weak
                        </span>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.weak}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase">
                          Better Version
                        </span>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          {item.replacement}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 8. BULLET POINT IMPROVEMENTS */}
            {result.bulletPointImprovements?.length > 0 && (
              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FaArrowUp className="text-blue-600" />
                  Bullet Point Improvements
                </h3>
                <ul className="space-y-3">
                  {result.bulletPointImprovements.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-600 flex gap-3"
                    >
                      <span className="text-blue-600 font-black">
                        {idx + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* 9. RECOMMENDED CAREER ROLES */}
            {result.recommendedRoles?.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FaBriefcase className="text-blue-600" />
                  <h3 className="font-black text-slate-800">
                    Recommended Career Roles
                  </h3>
                </div>
                <div className="space-y-4">
                  {result.recommendedRoles.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-800">
                            {item.role}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {item.reason}
                          </p>
                        </div>
                        <div className="text-lg font-black text-blue-600 shrink-0">
                          {item.matchPercentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}