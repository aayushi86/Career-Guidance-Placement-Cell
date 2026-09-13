import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ submitting: false, submitted: false, error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: "" });

    try {
      // Replace 'mqkvrxyz' with your real Formspree Form ID
      const response = await fetch("https://formspree.io/f/myegrwdb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ submitting: false, submitted: true, error: "" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Submission failed");
      }
    } catch (err) {
      setStatus({ submitting: false, submitted: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            📬 Get in Touch
          </div>
          <h1 className="text-4xl font-black text-slate-900">Contact Placement Support</h1>
          <p className="text-slate-500 text-sm">
            Have questions regarding campus recruitment drives, company onboarding, or career guidance?
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          {status.submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-500">
                Thank you for contacting CareerAI. We will reply directly to your email shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus({ ...status, submitted: false })}
                className="mt-4 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anurag Chaurasia"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@college.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message / Inquiry</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your questions regarding drives, recruitment, or portal features..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {status.error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                  {status.error}
                </div>
              )}

              <button
                type="submit"
                disabled={status.submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50 text-sm"
              >
                {status.submitting ? "Sending Inquiry..." : "Submit Message →"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}