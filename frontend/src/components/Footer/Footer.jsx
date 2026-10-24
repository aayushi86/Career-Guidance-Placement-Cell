import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="container-custom relative">
        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold shadow-lg shadow-blue-500/20">
                C
              </div>

              <span className="text-2xl font-bold">
                Career<span className="text-blue-400">AI</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              AI-powered career guidance helping students discover their
              potential, build the right skills, and achieve their career
              goals.
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/career-test"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  AI Career Recommendation
                </Link>
              </li>

              <li>
                <Link
                  to="/resume-analyzer"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Resume Analyzer
                </Link>
              </li>

              <li>
                <Link
                  to="/skill-gap"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Skill Gap Analysis
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Jobs & Internships
                </Link>
              </li>

              <li>
                <Link
                  to="/interview-prep"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Interview Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/career-roadmap"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Career Guide
                </Link>
              </li>

              <li>
                <Link
                  to="/resume-analyzer"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Resume Builder
                </Link>
              </li>

              <li>
                <Link
                  to="/interview-prep"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Interview Tips
                </Link>
              </li>

              <li>
                <Link
                  to="/ai-assistant"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Career Blog
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-slate-800 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 CareerAI. All rights reserved.</p>
          <p>Built to empower the next generation of professionals.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;