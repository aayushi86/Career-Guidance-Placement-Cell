import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  FaBrain,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaCode,
  FaTrophy,
  FaPaperPlane,
  FaRedo,
  FaEye,
} from "react-icons/fa";

export default function InterviewPrep() {
  const [interview, setInterview] = useState(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("career_token") ||
    localStorage.getItem("authToken");

  // Fetch latest interview or active session
  const fetchLatestInterview = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/interviews/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.interview) {
        setInterview(res.data.interview);
        // Find first unanswered question
        const firstUnanswered = res.data.interview.questions.findIndex(
          (q) => q.score === null
        );
        setActiveQuestionIdx(firstUnanswered !== -1 ? firstUnanswered : 0);
      }
    } catch (err) {
      console.log("No previous interview session found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestInterview();
  }, []);

  // Generate fresh AI interview session
  const generateNewInterview = async () => {
    if (!token) {
      setError("Please log in first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        `${API_URL}/interviews/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setInterview(res.data.interview);
        setActiveQuestionIdx(0);
        setStudentAnswer("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate mock interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for AI scoring (accepts optional override text for reveal action)
  const handleAnswerSubmit = async (overrideAnswer = null) => {
    const answerToSubmit = (overrideAnswer !== null ? overrideAnswer : studentAnswer).trim();

    if (!answerToSubmit || answerToSubmit.length < 5) {
      setError("Please type a substantive answer before submitting.");
      return;
    }

    const currentQ = interview.questions[activeQuestionIdx];
    try {
      setSubmitting(true);
      setError("");
      const res = await axios.post(
        `${API_URL}/interviews/${interview._id}/questions/${currentQ._id}/answer`,
        { answer: answerToSubmit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        const updatedQuestions = [...interview.questions];
        updatedQuestions[activeQuestionIdx] = res.data.question;
        setInterview({
          ...interview,
          questions: updatedQuestions,
          overallScore: res.data.overallScore,
          completed: res.data.completed,
        });
        setStudentAnswer("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = interview?.questions?.[activeQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/25">
                <FaBrain />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">
                  AI Mock Technical Interview
                </h1>
                <p className="text-xs text-slate-500">
                  Targeted questions generated from your roadmap skill gaps with real-time scoring.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={generateNewInterview}
            disabled={loading}
            className="text-xs font-bold py-2.5 px-4 bg-purple-600 hover:bg-purple-700"
          >
            <FaRedo className="mr-1.5" /> Start New Session
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-700">
              AI is formulating personalized technical questions...
            </p>
          </Card>
        )}

        {/* INTERVIEW ACTIVE SCREEN */}
        {interview && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QUESTION NAVIGATION SIDEBAR */}
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Target Role
                    </span>
                    <p className="text-sm font-black text-slate-800">
                      {interview.targetRole}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Score
                    </span>
                    <p className="text-base font-black text-purple-600">
                      {interview.overallScore || 0}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {interview.questions.map((q, idx) => (
                    <button
                      key={q._id}
                      onClick={() => {
                        setActiveQuestionIdx(idx);
                        setStudentAnswer("");
                        setError("");
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        activeQuestionIdx === idx
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate max-w-[170px]">
                        {idx + 1}. {q.skillFocus || "Question"}
                      </span>
                      {q.score !== null ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700">
                          {q.score}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Pending</span>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* QUESTION AND ANSWER PANEL */}
            <div className="lg:col-span-2 space-y-6">
              {currentQ && (
                <Card className="p-6">
                  {/* TAGS */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {currentQ.category}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {currentQ.skillFocus}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {currentQ.difficulty}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-slate-800 leading-relaxed mb-6">
                    {currentQ.question}
                  </h2>

                  {/* IF QUESTION ALREADY ANSWERED: DISPLAY AI SCORECARD */}
                  {currentQ.score !== null ? (
                    <div className="space-y-5 pt-4 border-t border-slate-100">
                      {/* SCORE BANNER */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaTrophy className="text-emerald-600 text-xl" />
                          <div>
                            <p className="text-[10px] font-black uppercase text-emerald-800">
                              Evaluation Score
                            </p>
                            <span className="text-2xl font-black text-emerald-700">
                              {currentQ.score} / 100
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SUBMITTED ANSWER */}
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          Your Submitted Answer:
                        </span>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mt-1">
                          {currentQ.studentAnswer}
                        </div>
                      </div>

                      {/* STRENGTHS & IMPROVEMENTS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5 mb-2">
                            <FaCheckCircle /> Strengths
                          </span>
                          <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                            {currentQ.feedback?.strengths?.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-black text-amber-600 flex items-center gap-1.5 mb-2">
                            <FaExclamationTriangle /> Needs Improvement
                          </span>
                          <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                            {currentQ.feedback?.improvements?.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* MODEL IDEAL ANSWER */}
                      {currentQ.feedback?.idealAnswer && (
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                          <span className="text-xs font-black text-blue-700 flex items-center gap-1.5 mb-2">
                            <FaLightbulb /> Model Candidate Answer
                          </span>
                          <pre className="text-xs text-blue-950 whitespace-pre-wrap font-sans leading-relaxed">
                            {currentQ.feedback.idealAnswer}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ANSWER INPUT AREA */
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-600 uppercase">
                        Type Your Technical Answer Below:
                      </label>
                      <textarea
                        rows={6}
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        placeholder="Explain concepts, syntax methods, data edge-cases, and reason step-by-step..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                          type="button"
                          onClick={() => {
                            const fallbackText = "I am unsure about this question. Please provide the ideal model answer.";
                            setStudentAnswer(fallbackText);
                            handleAnswerSubmit(fallbackText);
                          }}
                          disabled={submitting}
                          className="w-full sm:w-auto bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold py-3 px-4 flex items-center justify-center gap-1.5"
                        >
                          <FaEye /> Reveal Model Answer
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleAnswerSubmit()}
                          disabled={submitting}
                          className="w-full sm:flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-xs font-bold flex items-center justify-center gap-2 text-white"
                        >
                          {submitting ? (
                            "AI is evaluating your response..."
                          ) : (
                            <>
                              <FaPaperPlane /> Submit Answer for AI Evaluation
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}