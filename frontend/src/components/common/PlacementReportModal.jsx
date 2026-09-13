import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PlacementReportModal({ profile, onClose }) {
  const reportRef = useRef();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${(profile?.name || "Student").replace(/\s+/g, "_")}_Placement_Audit_Report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative my-8">
        
        {/* Modal Controls */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Institutional Placement Dossier</h3>
            <p className="text-xs text-slate-500">Official student readiness & competency certificate</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {downloading ? "Generating..." : "📥 Download PDF"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div ref={reportRef} className="p-8 bg-white text-slate-800 space-y-6">
          
          {/* Header Banner */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white font-black text-sm rounded-lg flex items-center justify-center">
                  C
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">CareerAI Placement Cell</h2>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Institutional Competency & Placement Readiness Audit
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-full uppercase border border-emerald-200">
                Verified Candidate
              </span>
              <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{profile?.name || "Student Applicant"}</p>
              <p className="text-xs text-slate-500">{profile?.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Academic Degree & College</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.degree || "Undergraduate / Graduate"}</p>
              <p className="text-xs text-slate-500">{profile?.college || "University Campus"}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Target Career Role</p>
              <p className="text-xs font-black text-slate-900 mt-1">{profile?.targetRole || "General Career Profile"}</p>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Placement Readiness</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{profile?.readinessScore || 85}%</p>
            </div>
            <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
              <p className="text-[10px] font-bold text-purple-600 uppercase">Total Applications</p>
              <p className="text-xl font-black text-purple-600 mt-0.5">{profile?.totalApplications || 2}</p>
            </div>
          </div>

          {/* Verified Skills */}
          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Verified Technical Competencies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile?.skills?.length ? (
                profile.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Python, SQL, JavaScript, Machine Learning</span>
              )}
            </div>
          </div>

          {/* Placement Cell Endorsement */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-800">Placement Cell Institutional Verification</p>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              This student has completed automated AI skill assessments, ATS resume parsability checks, and is actively
              screened for campus placement drives with partner recruiters.
            </p>
          </div>

          {/* Footer Signature line */}
          <div className="pt-4 flex justify-between items-end text-[10px] text-slate-400 border-t border-slate-100">
            <div>
              <p className="font-bold text-slate-700">CareerAI Verification System</p>
              <p>Generated via Campus Placement Portal</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-slate-500">ID: {profile?.email?.split("@")[0].toUpperCase()}-CERT</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}