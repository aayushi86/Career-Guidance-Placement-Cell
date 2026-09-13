import { useState, useEffect } from "react";
import { skillApi } from "../services/skillApi";
import CareerRoleSelector from "../components/common/CareerRoleSelector";
import { request } from "../services/api";
import { FaPlus, FaSearch, FaCheckSquare, FaSquare, FaBolt, FaExclamationTriangle, FaCheckCircle, FaBrain } from "react-icons/fa";

export default function SkillGap() {
  const [targetDomain, setTargetDomain] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkills, setCustomSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [availableSkillsPool, setAvailableSkillsPool] = useState([]);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Base fallback skill pool grouped by domain/roles
  const defaultSkillsPool = [
    "Python", "SQL", "Excel", "Financial Modeling", "Statistics", "Machine Learning", "Data Analysis",
    "Pandas", "JavaScript", "React", "Node.js", "MongoDB", "Tally & GST", "SEO & Analytics", "Copywriting",
    "Social Media Strategy", "Recruitment", "Figma / UI Design", "HTML/CSS", "Git", "Artificial Intelligence",
    "Power BI", "Tableau", "AWS", "Communication", "Accounting", "Requirements Gathering", "Financial Analysis",
    "Valuation", "Content Strategy", "HR Operations", "Process Mapping", "Project Management"
  ];

  // 1. Initial prefill from Career Test / Profile
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
        "Data Analyst";

      const initDomain =
        savedResult.topDomain ||
        savedResult.targetDomain ||
        rawUser.targetDomain ||
        "";

      const initSkills = savedResult.skills || rawUser.skills || ["Python", "SQL", "Excel"];

      if (initRole) setTargetRole(initRole);
      if (initDomain) setTargetDomain(initDomain);
      if (initSkills && initSkills.length > 0) setSelectedSkills(initSkills);
    } catch {
      // ignore
    }
  }, []);

  // 2. Load role skill requirements when targetRole changes to update skill checkboxes
  useEffect(() => {
    let isMounted = true;
    if (!targetRole) return;

    const fetchRoleSkills = async () => {
      try {
        const res = await request(`/career/domains`);
        if (res.success && res.rolesByDomain) {
          // Keep pool rich with default pool + current selected skills + custom skills
          const combined = Array.from(
            new Set([...defaultSkillsPool, ...selectedSkills, ...customSkills])
          );
          if (isMounted) setAvailableSkillsPool(combined);
        }
      } catch (err) {
        if (isMounted) setAvailableSkillsPool(Array.from(new Set([...defaultSkillsPool, ...selectedSkills, ...customSkills])));
      }
    };

    fetchRoleSkills();

    return () => {
      isMounted = false;
    };
  }, [targetRole, customSkills]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    if (!customSkills.includes(trimmed)) {
      setCustomSkills([...customSkills, trimmed]);
    }
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setNewSkillInput("");
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await skillApi.analyzeGap({
        targetRole,
        targetDomain,
        currentSkills: selectedSkills,
        skills: selectedSkills,
      });

      if (res.success) {
        setAnalysisResult({
          targetRole: res.targetRole || targetRole,
          targetDomain: res.targetDomain || targetDomain,
          readinessScore: res.readinessScore ?? res.score ?? 0,
          skillGapPercentage: res.skillGapPercentage ?? (100 - (res.readinessScore || 0)),
          matchedSkills: res.matchedSkills || res.matched || [],
          missingSkills: res.missingSkills || res.missing || [],
          missingWithPriority: res.missingWithPriority || res.learningRecommendations || [],
          recommendation: res.recommendation || "Focus on mastering missing skills to optimize clearance.",
        });
      } else {
        throw new Error(res.message || "Failed to analyze skill gap");
      }
    } catch (err) {
      console.error("Skill gap analysis error:", err);
      setError(err.message || "Failed to analyze skill gap.");
    } finally {
      setLoading(false);
    }
  };

  // Filter skills pool based on search query
  const displayedSkills = availableSkillsPool.filter((s) =>
    s.toLowerCase().includes(skillSearchQuery.toLowerCase().trim())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-blue-200">
          ⚡ Skill Gap & Readiness Analyzer
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Benchmark Your Placement Readiness
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Select your target domain and career role, check off your verified skills, and compute real-time placement fit.
        </p>
      </div>

      {/* Main Selector & Skills Form */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Reusable Searchable Role Component */}
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

        {/* Current Skills Checkbox Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Current Verified Skills
              </label>
              <p className="text-[11px] text-slate-400">
                Check off skills you currently possess ({selectedSkills.length} selected)
              </p>
            </div>

            {/* Search skills input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500"
              />
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>
          </div>

          {/* Checkboxed Skills List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
            {displayedSkills.map((skill) => {
              const isChecked = selectedSkills.includes(skill);
              return (
                <label
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition select-none ${
                    isChecked
                      ? "bg-blue-50/80 border-blue-200 text-blue-900 font-bold shadow-xs"
                      : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-100/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent onClick
                    className="hidden"
                  />
                  {isChecked ? (
                    <FaCheckSquare className="text-blue-600 shrink-0 text-sm" />
                  ) : (
                    <FaSquare className="text-slate-300 shrink-0 text-sm" />
                  )}
                  <span className="truncate">{skill}</span>
                </label>
              );
            })}
          </div>

          {/* Add Custom Skill Form */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add another custom skill (e.g. Risk Analysis, React, Docker)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <FaPlus className="text-xs" />
              <span>Add Skill</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={runAnalysis}
          disabled={loading || !targetRole}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FaBolt />
              <span>Analyze Skill Gap & Placement Fit</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result Display */}
      {analysisResult && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                {analysisResult.targetDomain || "Career Evaluation"}
              </span>
              <h3 className="text-2xl font-black mt-2">{analysisResult.targetRole}</h3>
            </div>
            <div className="flex items-center gap-4 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
              <div>
                <span className="text-3xl font-black text-emerald-400">{analysisResult.readinessScore}%</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Readiness Score</span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <span className="text-3xl font-black text-amber-400">{analysisResult.skillGapPercentage}%</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Skill Gap</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <FaCheckCircle /> Verified Matched Skills ({analysisResult.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.matchedSkills.length > 0 ? (
                  analysisResult.matchedSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No matching skills selected yet.</span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <FaExclamationTriangle /> Missing Skills for {analysisResult.targetRole} ({analysisResult.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/30">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400">All target role requirements acquired!</span>
                )}
              </div>
            </div>
          </div>

          {/* Missing Skills Priority Breakdown */}
          {analysisResult.missingWithPriority?.length > 0 && (
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Prioritized Skill Gap Action Plan
              </p>
              <div className="space-y-2">
                {analysisResult.missingWithPriority.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white">{item.skill}</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">{item.whyNeeded}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      item.priority === "High"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : item.priority === "Medium"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-300 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            💡 <strong className="text-white">Strategic Recommendation:</strong> {analysisResult.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}