import { Link } from "react-router-dom";
import { FaBrain, FaRocket, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            🏛️ About CareerAI
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
            Empowering Campus Placement with AI
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            CareerAI is an intelligent placement cell management platform designed to help students discover their potential, bridge skill gaps, optimize resumes, and connect with top recruiters.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              <FaBrain />
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI Career Guidance</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Personalized career matching algorithms assist students in understanding domain readiness and mapping out actionable milestones.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
              <FaRocket />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Placement Automation</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Seamless drive publishing, job application tracking, ATS resume analysis, and recruiter approval workflows all in one place.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Recruiter Connect</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Direct connection between verified corporate recruiters and job-ready students across engineering and management disciplines.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verified & Secure</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Role-based access control, OTP-authenticated sign-in, admin drive authorization, and student data protection.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to Start Your Career Journey?</h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Take our AI Career Assessment or explore live campus placement drives today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/career-test"
              className="px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition shadow-lg"
            >
              Take Career Test →
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 font-bold text-sm rounded-xl hover:bg-white/20 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
