import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaSearch,
  FaChartLine,
  FaFileAlt,
  FaBriefcase,
} from "react-icons/fa";

import { Button, Badge } from "../ui";

function Hero() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const quickSearches = [
    "Data Analyst",
    "Python Developer",
    "Full Stack Developer",
  ];

  const handleSearch = () => {
  if (search.trim() === "") return;
  navigate(`/jobs?search=${search}`); // ✅ REDIRECT
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickSearch = (value) => {
  navigate(`/jobs?search=${value}`); // ✅ direct redirect
};

  return (
    <section className="relative overflow-hidden bg-slate-50">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="container-custom relative z-10">

        <div className="grid items-center gap-12 py-12 md:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">

          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <Badge>
              ✦ AI-Powered Career Platform
            </Badge>

            {/* Heading */}
            <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">

              Build Your

              <span className="gradient-text block">
                Dream Career
              </span>

              With AI
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover the right career path, improve your resume,
              identify skill gaps, find relevant opportunities, and
              prepare for interviews — all in one intelligent platform.
            </p>


            {/* ================= SEARCH ================= */}
            <div className="mt-7">

              <div className="flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-primary transition-all duration-300 focus-within:border-blue-300 focus-within:shadow-xl">

                <FaSearch className="ml-4 shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearched(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search jobs, companies or skills..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400"
                />

                <Button
                  size="md"
                  onClick={handleSearch}
                >
                  Search
                </Button>

              </div>


              {/* Quick Searches */}
              <div className="mt-3 flex flex-wrap items-center gap-2">

                <span className="mr-1 text-xs font-medium text-slate-400">
                  Popular:
                </span>

                {quickSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickSearch(item)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {item}
                  </button>
                ))}

              </div>


              {/* Search Result */}
              {searched && search.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 max-w-2xl rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />

                    <span>
                      Showing opportunities related to{" "}
                      <strong>{search}</strong>
                    </span>
                  </div>
                </motion.div>
              )}

            </div>


            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-4">

              <Button
              size="lg"
               onClick={() => {
                window.location.href = "/career-test";
                 }}
>
  Take Career Test
  <FaArrowRight className="ml-2" />
</Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/jobs")}
              >
                Explore Jobs
              </Button>

            </div>


            {/* Trust Points */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                AI-powered recommendations
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Personalized roadmap
              </span>

            </div>

          </motion.div>


          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >

            {/* Main AI Panel */}
            <div className="glass relative rounded-[2rem] border border-white/70 p-6 shadow-primary">

              {/* Header */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    CareerAI Assistant
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Your Career Overview
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                  ✦
                </div>

              </div>


              {/* Career Match */}
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-blue-100">
                      AI Career Match
                    </p>

                    <h4 className="mt-1 text-2xl font-bold">
                      Data Scientist
                    </h4>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      96%
                    </p>

                    <p className="text-xs text-blue-100">
                      Match
                    </p>
                  </div>

                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "96%" }}
                    transition={{
                      duration: 1.2,
                      delay: 0.6,
                    }}
                    className="h-full rounded-full bg-white"
                  />

                </div>

              </div>


              {/* Analytics */}
              <div className="mt-5 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <FaFileAlt />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Resume Score
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        92/100
                      </p>
                    </div>

                  </div>

                </div>


                <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <FaChartLine />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Skill Growth
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        +34%
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              {/* Job Match */}
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <FaBriefcase />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Recommended Opportunities
                    </p>

                    <p className="font-bold text-slate-900">
                      128 Jobs Matched
                    </p>
                  </div>

                </div>

                <FaArrowRight className="text-slate-400" />

              </div>

            </div>


            {/* Floating Notification */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-6 top-20 hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:block"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    New Match
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    Career Updated
                  </p>
                </div>

              </div>

            </motion.div>


            {/* Floating Job Card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-5 bottom-16 hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:block"
            >

              <p className="text-xs text-slate-500">
                New Opportunity
              </p>

              <p className="mt-1 font-bold text-slate-800">
                ML Engineer
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-600">
                94% Match
              </p>

            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}

export default Hero;