import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../services/api";

export default function JNFModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Mumbai / Hybrid",
    jobType: "Full-time",
    salaryPackage: "6 - 9 LPA",
    experienceLevel: "Freshers (2025/2026 Batch)",
    requiredSkills: "Python, JavaScript, Data Analysis, SQL",
    eligibleBranches: "Computer Engineering, IT, AI & Data Science, EXTC",
    minCgpa: 6.5,
    applicationDeadline: "2026-04-30",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        ...formData,
        recruiterEmail: user.email || "recruiter@partner.com",
        eligibleBranches: formData.eligibleBranches.split(",").map((b) => b.trim()),
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      };

      const res = await axios.post(`${API_URL}/jobs/jnf`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.success) {
        alert("✅ Job Notification Form (JNF) published for campus recruitment!");
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      console.error("JNF post error:", err);
      alert("Failed to submit JNF form. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              IITM CDC Standard
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Job Notification Form (JNF)
            </h2>
            <p className="text-xs text-slate-500">
              Submit campus recruitment drive requirements & eligibility cutoffs
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company / Organization Name *</label>
              <input
                type="text"
                name="company"
                required
                placeholder="e.g. Microsoft, Infosys, Tech Partner"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Designation / Role Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Associate Software Engineer"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CTC Package (LPA)</label>
              <input
                type="text"
                name="ctcPackage"
                placeholder="e.g. 12-16 LPA"
                value={formData.ctcPackage}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Min. AI Assessment Cutoff (%)</label>
              <input
                type="number"
                name="minAssessmentScore"
                min="0"
                max="100"
                value={formData.minAssessmentScore}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Min. CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Eligible Academic Degrees & Branches</label>
            <input
              type="text"
              name="eligibleBranches"
              placeholder="Comma-separated: B.Sc IT, B.Tech CSE, MCA"
              value={formData.eligibleBranches}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mandatory Technical Skills</label>
            <input
              type="text"
              name="requiredSkills"
              placeholder="Comma-separated: Python, SQL, JavaScript, React"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Job Description & Responsibilities</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detail the technical responsibilities, team structure, and campus joining requirements..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              {loading ? "Publishing JNF..." : "🚀 Publish Placement Drive (JNF)"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}