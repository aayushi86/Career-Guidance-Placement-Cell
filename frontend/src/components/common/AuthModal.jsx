import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/authApi";

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.sendOtp(email);
      if (res.success) {
        setStep("otp");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.verifyOtp({ email, otp, name, role });
      if (res.success) {
        login(res.user, res.token);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
            🔑
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {step === "email" ? "Passwordless Sign In" : "Enter Verification Code"}
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            {step === "email"
              ? "We'll send a 6-digit secure OTP to your email."
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    role === "recruiter" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                  }`}
                >
                  💼 Recruiter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anurag Chaurasia"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Verification OTP →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[8px] font-black text-2xl bg-slate-50 border border-slate-200 rounded-xl py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Complete Sign In →"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("email"); setOtp(""); setError(""); }}
              className="w-full text-xs text-slate-500 font-bold hover:text-slate-800 text-center block pt-2"
            >
              ← Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}