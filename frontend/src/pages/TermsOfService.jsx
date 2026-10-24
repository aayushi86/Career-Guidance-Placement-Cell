import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">
            📋 Terms & Conditions
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Last updated: October 2026 • CareerAI Placement Management Cell
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">1. Acceptance of Terms</h2>
            <p>
              By accessing and registering on CareerAI, students, recruiters, and placement officers agree to abide by institutional guidelines, placement drive policies, and platform conduct standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">2. Student & Recruiter Conduct</h2>
            <p>
              Students must ensure all resume details and skill qualifications are accurate. Recruiters must maintain genuine job drive postings verified and authorized by the Placement Cell Administration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">3. AI Recommendations Disclaimer</h2>
            <p>
              CareerAI insights, resume ATS scores, and skill gap roadmaps are calculated algorithmically to serve as supportive guidance. Placement outcomes depend on recruiter evaluation and interview performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">4. Support & Contacts</h2>
            <p>
              If you have any questions or require administrative assistance, please contact the Placement Support team via our{" "}
              <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
                Contact Form
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
