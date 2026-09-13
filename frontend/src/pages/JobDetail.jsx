import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobsApi } from "../services/jobsApi";
import { FaMagic, FaCheckCircle, FaExclamationCircle, FaGraduationCap, FaBrain, FaBookOpen, FaArrowLeft, FaBookmark, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaCheck, FaBuilding, FaShareAlt } from "react-icons/fa";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobAndMatch = async () => {
      try {
        setLoading(true);
        const res = await jobsApi.getJobById(id);
        if (res.success) {
          setJob(res.job);
        }

        if (user && user.role === "student") {
          setMatchLoading(true);
          try {
            const matchRes = await jobsApi.getJobMatch(id);
            if (matchRes.success && matchRes.match) {
              setMatchData(matchRes.match);
            }
          } catch (mErr) {
            console.error("Match error:", mErr);
          } finally {
            setMatchLoading(false);
          }
        }
      } catch (err) {
        setError("Unable to load job posting details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndMatch();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) return alert("Please sign in as a student to apply.");
    setApplying(true);
    try {
      const res = await jobsApi.applyJob({
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        applicantEmail: user.email,
        applicantName: user.name,
        careerScore: matchData ? matchData.matchScore : undefined,
      });
      if (res.success) setApplied(true);
    } catch (err) {
      alert(err.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Placement Job Opening Not Found</h2>
        <Link to="/jobs" className="text-indigo-600 font-bold text-sm hover:underline">
          ← Return to All Placement Drives
        </Link>
      </div>
    );
  }

  const applicantCount = job.applicantCount || 0;
  const postedDaysAgo = job.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))) : 2;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 hover:text-slate-800 transition">
            <FaArrowLeft /> Back to Placement Drives
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSaved(!saved)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border transition ${
                saved ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FaBookmark className={saved ? "text-amber-500" : "text-slate-400"} />
              {saved ? "Saved" : "Save Job"}
            </button>
            <Link to="/jobs" className="hover:text-indigo-600">
              Browse Similar Jobs →
            </Link>
          </div>
        </div>

        {/* HERO HEADER CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {job.company ? job.company.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider border border-indigo-100">
                    {job.jobType || "Full-time"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Posted {postedDaysAgo} day{postedDaysAgo !== 1 ? "s" : ""} ago
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{job.title}</h1>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">{job.company}</p>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applied || applying}
              className={`px-8 py-3 rounded-2xl font-bold text-sm shadow-lg transition ${
                applied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none cursor-default"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25"
              }`}
            >
              {applied ? "✓ Applied Successfully" : applying ? "Submitting..." : "Apply Now →"}
            </button>
          </div>

          {/* QUICK DETAILS SUMMARY BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Location / Work Mode</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <FaMapMarkerAlt className="text-slate-400" /> {job.location || "Mumbai / Hybrid"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Package / CTC</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <FaDollarSign className="text-emerald-500" /> {job.ctcPackage || "10-14 LPA"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Applicant Count</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <FaBriefcase className="text-slate-400" /> {applicantCount} Applicants
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Cutoff Requirement</span>
              <span className="font-bold text-indigo-600 flex items-center gap-1 mt-0.5">
                <FaGraduationCap className="text-indigo-400" /> {job.minAssessmentScore || 75}% Assessment
              </span>
            </div>
          </div>

          {/* DYNAMIC AI MATCH CARD FOR LOGGED-IN STUDENTS */}
          {user && user.role === "student" && (
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                    <FaMagic /> Deterministic Placement Compatibility
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">Your AI Match</h2>
                </div>

                {matchLoading ? (
                  <div className="text-xs text-indigo-200">Calculating job compatibility...</div>
                ) : matchData ? (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                        matchData.eligibility === "ELIGIBLE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : matchData.eligibility === "PARTIALLY MATCHED"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {matchData.eligibility}
                    </span>
                    <div className="text-3xl font-black text-indigo-300">{matchData.matchScore}%</div>
                  </div>
                ) : null}
              </div>

              {matchData && (
                <div className="space-y-4 text-xs">
                  {/* Detailed Metric Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                    <div>
                      <span className="text-indigo-300 text-[10px] uppercase font-bold">Skill Match</span>
                      <p className="text-base font-black text-white mt-0.5">{matchData.skillMatchScore}%</p>
                    </div>
                    <div>
                      <span className="text-indigo-300 text-[10px] uppercase font-bold">Role Alignment</span>
                      <p className="text-base font-black text-white mt-0.5">{matchData.careerMatchScore}%</p>
                    </div>
                    <div>
                      <span className="text-indigo-300 text-[10px] uppercase font-bold">Academic Branch</span>
                      <p className="text-base font-black text-white mt-0.5">{matchData.eduScore}%</p>
                    </div>
                    <div>
                      <span className="text-indigo-300 text-[10px] uppercase font-bold">ATS Benchmark</span>
                      <p className="text-base font-black text-white mt-0.5">
                        {matchData.studentProfile?.atsScore ? `${matchData.studentProfile.atsScore}%` : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1 text-xs">
                        <FaCheckCircle /> Matched Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {matchData.matchedSkills && matchData.matchedSkills.length > 0 ? (
                          matchData.matchedSkills.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded text-[10px] font-bold">
                              ✓ {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/60 italic text-[10px]">General domain alignment</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-rose-400 flex items-center gap-1 text-xs">
                        <FaExclamationCircle /> Missing Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {matchData.missingSkills && matchData.missingSkills.length > 0 ? (
                          matchData.missingSkills.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded text-[10px] font-bold">
                              • {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-300 font-bold text-[10px]">✓ All core skills matched!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {matchData.learningRecommendation && (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-100 flex items-start gap-2 text-xs">
                      <FaBookOpen className="text-indigo-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-white block">AI Recommendation:</span>
                        {matchData.learningRecommendation}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* JOB HIGHLIGHTS */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Job Highlights</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span> Cutoff Score: {job.minAssessmentScore || 75}% Assessment
              </li>
              <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span> Eligible Branches: {job.eligibleBranches?.join(", ") || "B.Sc IT, B.Tech CSE"}
              </li>
              <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span> Direct Placement Interview Drive
              </li>
              <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span> Placement Cell Verified Recruiter
              </li>
            </ul>
          </div>

          {/* JOB DESCRIPTION & RESPONSIBILITIES */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-black text-slate-900">About the Job & Role Responsibilities</h3>
            <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* REQUIRED QUALIFICATIONS & ELIGIBILITY */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-black text-slate-900">Eligibility Criteria & Qualifications</h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
              <p><strong className="text-slate-900">Minimum CGPA:</strong> {job.minCgpa || 7.0} CGPA</p>
              <p><strong className="text-slate-900">Eligible Streams:</strong> {job.eligibleBranches?.join(", ") || "B.Sc IT, B.Tech CSE, MCA"}</p>
              <p><strong className="text-slate-900">Selection Process:</strong> {job.selectionProcess?.join(" → ") || "AI Skill Screening → Technical Interview → HR Discussion"}</p>
            </div>
          </div>

          {/* REQUIRED COMPETENCIES */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-black text-slate-900">Required Skills & Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills && job.requiredSkills.length > 0 ? (
                job.requiredSkills.map((s, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/60">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Standard software engineering competencies</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-slate-900">{job.title}</h4>
            <p className="text-xs font-bold text-indigo-600">{job.company} • {job.location || "Mumbai"}</p>
          </div>

          <div className="flex items-center gap-3">
            {applied ? (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-2xl">
                  ✓ Applied
                </span>
                <Link to="/my-applications" className="text-xs font-bold text-indigo-600 hover:underline">
                  Track Status →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition"
              >
                {applying ? "Submitting..." : "Apply Now →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}