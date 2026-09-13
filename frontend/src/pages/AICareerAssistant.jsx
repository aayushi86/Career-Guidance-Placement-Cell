import { useState } from "react";
import { request, API_URL } from "../services/api";

export default function AICareerAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const prompt = message.trim();
    if (!prompt || loading) return;

    setLoading(true);
    setError("");

    // Optimistically update conversation history with user message
    const userEntry = { user: prompt, bot: "" };
    setChat((prev) => [...prev, userEntry]);
    setMessage("");

    try {
      let botResponse = "";

      // 1. Primary: Use central api helper (attaches JWT automatically)
      if (typeof request === "function") {
        const data = await request("/assistant", {
          method: "POST",
          body: JSON.stringify({ message: prompt }),
        });
        botResponse = data?.answer || data?.reply || data?.message;
      } else {
        // 2. Direct fallback with manual Bearer token
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/assistant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ message: prompt }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}: Unauthorized`);
        }
        botResponse = data?.answer || data?.reply || data?.message;
      }

      // Update the pending chat message with the assistant's reply
      setChat((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? { ...item, bot: botResponse || "No response generated." }
            : item
        )
      );
    } catch (err) {
      console.error("AI Assistant Error:", err);
      const errMsg =
        err?.message || "Failed to get AI recommendation. Please check your session.";
      setError(errMsg);

      // Reflect error inside the chat transcript
      setChat((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? { ...item, bot: `⚠️ Error: ${errMsg}` }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
          AI Career Assistant 🤖
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask questions about role recommendations, skills alignment, and placement prep.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Chat History Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-sm">
        {chat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
            <span className="text-3xl mb-2">💡</span>
            <p className="text-sm font-semibold">No questions asked yet.</p>
            <p className="text-xs mt-1 text-slate-400">
              Try: "I know Python, SQL and MongoDB. Which career should I choose?"
            </p>
          </div>
        ) : (
          chat.map((c, i) => (
            <div key={i} className="space-y-2 text-sm">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] font-medium">
                  {c.user}
                </div>
              </div>

              {/* Bot Bubble */}
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] whitespace-pre-wrap leading-relaxed border border-slate-200/60">
                  {c.bot ? (
                    c.bot
                  ) : (
                    <span className="italic text-slate-400 flex items-center gap-2">
                      Thinking...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about career paths, skills, or interviews..."
          disabled={loading}
          className="border border-slate-200 rounded-xl px-4 py-3 w-full text-sm outline-none focus:ring-2 focus:ring-blue-600 bg-white"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-sm shrink-0"
        >
          {loading ? "Analyzing..." : "Send"}
        </button>
      </form>
    </div>
  );
}