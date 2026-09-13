import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="container-custom relative">

        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold shadow-lg shadow-blue-500/20">
                C
              </div>

              <span className="text-2xl font-bold">
                Career<span className="text-blue-400">AI</span>
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              AI-powered career guidance helping students discover their
              potential, build the right skills, and achieve their career
              goals.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-500 hover:text-white"
              >
                <FaTwitter />
              </a>

            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  AI Career Recommendation
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Resume Analyzer
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Skill Gap Analysis
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Jobs & Internships
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Interview Preparation
                </a>
              </li>

            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Career Guide
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Resume Builder
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Interview Tips
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Career Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  FAQs
                </a>
              </li>

            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  Terms of Service
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-slate-800 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 CareerAI. All rights reserved.
          </p>

          <p>
            Built to empower the next generation of professionals.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;