import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../common/AuthModal";
import NotificationDropdown from "./NotificationDropdown";
import { FaBrain } from "react-icons/fa";

export default function Navbar({ onOpenAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [authModal, setAuthModal] = useState({
    open: false,
    mode: "signin",
  });

  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeDropdown = () => setDropdownOpen(false);
  const closeMobileMenu = () => setIsOpen(false);

  const handleOpenAuth = (mode = "signin") => {
    if (typeof onOpenAuth === "function") {
      onOpenAuth(mode);
    } else {
      setAuthModal({ open: true, mode });
    }
  };

  return (
    <>
      {/* ================= HEADER / NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* ================= LOGO ================= */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3 shrink-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-xl font-black text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
              C
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-black leading-none tracking-tight text-slate-900">
                Career
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Placement Cell
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 backdrop-blur-md">
            {/* HOME */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                isActive("/") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home
            </Link>

            {/* STUDENT & GUEST VIEWS */}
            {(!user || user.role === "student") && (
              <>
                {user && (
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      isActive("/dashboard") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}

                {/* AI TOOLS DROPDOWN */}
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      dropdownOpen ||
                      isActive("/career-test") ||
                      isActive("/resume-analyzer") ||
                      isActive("/skill-gap") ||
                      isActive("/career-roadmap")
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>AI Tools</span>
                    <span className="text-xs">▾</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 grid w-72 gap-1.5 rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl">
                      <Link
                        to="/career-test"
                        onClick={closeDropdown}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-blue-50/70"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          🎯
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Career Test</p>
                          <p className="text-xs text-slate-500">AI path matcher & roadmaps</p>
                        </div>
                      </Link>

                      <Link
                        to="/resume-analyzer"
                        onClick={closeDropdown}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-purple-50/70"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                          📄
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Resume Analyzer</p>
                          <p className="text-xs text-slate-500">ATS scoring & optimization</p>
                        </div>
                      </Link>

                      <Link
                        to="/career-roadmap"
                        onClick={closeDropdown}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-indigo-50/70"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                          <FaBrain />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">AI Career Roadmap</p>
                          <p className="text-xs text-slate-500">4-month milestone action plan</p>
                        </div>
                      </Link>

                      <Link
                        to="/skill-gap"
                        onClick={closeDropdown}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-emerald-50/70"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                          📊
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Skill Gap Analysis</p>
                          <p className="text-xs text-slate-500">Benchmark target skills</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* JOBS */}
                <Link
                  to="/jobs"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive("/jobs") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Jobs <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md">LIVE</span>
                </Link>

                {/* MY APPLICATIONS */}
                {user && (
                  <Link
                    to="/my-applications"
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      isActive("/my-applications") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    My Applications
                  </Link>
                )}
              </>
            )}

            {/* RECRUITER CONSOLE (Restricted) */}
            {user?.role === "recruiter" && (
              <Link
                to="/recruiter/dashboard"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  isActive("/recruiter/dashboard") ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Recruiter Console
              </Link>
            )}

            {/* ADMIN CONSOLE (Restricted) */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  isActive("/admin") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Placement Cell
              </Link>
            )}

            {/* CONTACT */}
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                isActive("/contact") ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* ================= AUTH ACTIONS ================= */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.role === "student" && <NotificationDropdown />}

                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-800">{user.name}</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={`text-[10px] font-bold uppercase ${user.role === "recruiter" ? "text-indigo-600" : "text-emerald-600"}`}>
                      {user.role}
                    </span>
                    {user.role === "student" && (
                      <Link to="/profile" className="text-[10px] text-blue-600 font-semibold hover:underline">
                        • Edit Profile
                      </Link>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenAuth("signin")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition"
              >
                Sign In →
              </button>
            )}

            {/* MOBILE TOGGLE */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-xl bg-slate-100 p-2.5 text-slate-700 transition hover:bg-slate-200"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

        </div>

        {/* ================= MOBILE MENU ================= */}
        {isOpen && (
          <div className="space-y-3 border-b border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-2 text-base font-bold text-slate-800"
            >
              Home
            </Link>

            {(!user || user.role === "student") && (
              <>
                {user && (
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-bold text-slate-800"
                  >
                    Dashboard
                  </Link>
                )}

                <Link
                  to="/career-test"
                  onClick={closeMobileMenu}
                  className="block py-2 text-base font-bold text-slate-800"
                >
                  🎯 Career Test
                </Link>

                <Link
                  to="/resume-analyzer"
                  onClick={closeMobileMenu}
                  className="block py-2 text-base font-bold text-slate-800"
                >
                  📄 Resume Analyzer
                </Link>

                <Link
                  to="/career-roadmap"
                  onClick={closeMobileMenu}
                  className="block py-2 text-base font-bold text-slate-800"
                >
                  🧠 AI Career Roadmap
                </Link>

                <Link
                  to="/skill-gap"
                  onClick={closeMobileMenu}
                  className="block py-2 text-base font-bold text-slate-800"
                >
                  📊 Skill Gap Analysis
                </Link>

                <Link
                  to="/jobs"
                  onClick={closeMobileMenu}
                  className="block py-2 text-base font-bold text-slate-800"
                >
                  💼 Jobs
                </Link>

                {user && (
                  <Link
                    to="/my-applications"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-bold text-slate-800"
                  >
                    📋 My Applications
                  </Link>
                )}
              </>
            )}

            {user?.role === "recruiter" && (
              <Link
                to="/recruiter/dashboard"
                onClick={closeMobileMenu}
                className="block py-2 text-base font-bold text-indigo-600"
              >
                🏢 Recruiter Console
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="block py-2 text-base font-bold text-blue-600"
              >
                🏛️ Placement Cell
              </Link>
            )}

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block py-2 text-base font-bold text-slate-800"
            >
              📞 Contact
            </Link>

            {/* MOBILE AUTH ACTIONS */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
              {user ? (
                <>
                  {user.role === "student" && (
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-semibold text-slate-700">Notifications</span>
                      <NotificationDropdown />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full rounded-xl bg-red-50 py-3 text-center font-bold text-red-600"
                  >
                    Log Out ({user.name})
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleOpenAuth("signin");
                    setIsOpen(false);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-3 text-center font-bold text-white"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= AUTH MODAL FALLBACK ================= */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, open: false })}
      />
    </>
  );
}