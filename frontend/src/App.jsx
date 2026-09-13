import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CareerTest from "./pages/CareerTest";
import Jobs from "./pages/Jobs";
import SkillGap from "./pages/SkillGap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar/Navbar";
import StudentProfile from "./pages/StudentProfile";
import Contact from "./pages/Contact";
import JobDetail from "./pages/JobDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AICareerAssistant from "./pages/AICareerAssistant";
import InterviewPrep from "./pages/InterviewPrep";
import CareerRoadmap from "./pages/CareerRoadmap";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* NAVBAR */}
      <Navbar />

      <main className="relative">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/career-test" element={<CareerTest />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-assistant" element={<AICareerAssistant />} />

          {/* ================= STUDENT ROUTES (PROTECTED) ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />

          <Route
            path="/career-roadmap"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CareerRoadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* ================= RECRUITER ROUTE ================= */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTE ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}