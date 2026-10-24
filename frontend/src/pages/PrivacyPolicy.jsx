import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            🔒 Legal & Security
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Last updated: October 2026 • CareerAI Placement Management Cell
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">1. Information We Collect</h2>
            <p>
              CareerAI collects essential student profile details (name, contact email, education details, target career roles, uploaded resumes) and recruiter drive information to facilitate campus recruitment and career guidance services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">2. How Information Is Used</h2>
            <p>
              Your data is exclusively processed to match student skills against job specifications, generate AI-assisted career feedback, notify candidates of application updates, and present aggregate placement analytics to institution admins.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption, passwordless OTP authentication, and strict role-based authorization to ensure student data and corporate job drive details remain secure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">4. Contact Us</h2>
            <p>
              For data access requests or privacy questions, please reach out to the Placement Cell Admin via our{" "}
              <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
                Contact Page
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
