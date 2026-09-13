import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaBrain,
  FaFileAlt,
  FaChartLine,
  FaBriefcase,
  FaRobot,
  FaBullseye,
  FaArrowRight,
} from "react-icons/fa";

import { HiSparkles } from "react-icons/hi2";

import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";

// Motion container variants for staggered child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function FeatureCard({ feature }) {
  const Icon = feature.icon;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic spotlight tracker
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={feature.link || "#"}>
      <Card
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative h-full overflow-hidden rounded-3xl
          border border-slate-200/80 bg-white/80 p-8
          backdrop-blur-sm transition-all duration-300
          hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50
        `}
      >
        {/* Dynamic Interactive Spotlight Glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
              : "",
          }}
        />

        {/* Featured Tag */}
        {feature.featured && (
          <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            <HiSparkles className="h-3.5 w-3.5 text-blue-500" /> Popular
          </div>
        )}

        {/* Gradient Icon Container */}
        <div className="relative mb-6">
          <div
            className={`
              flex h-14 w-14 items-center justify-center rounded-2xl
              bg-gradient-to-br ${feature.gradient} text-xl text-white
              shadow-md shadow-blue-500/10
              transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110
            `}
          >
            <Icon />
          </div>
        </div>

        {/* Title */}
        <h3 className="relative mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="relative text-sm leading-relaxed text-slate-600">
          {feature.description}
        </p>

        {/* Action Link */}
        <div className="relative mt-8 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span className="transition-colors group-hover:text-blue-700">
            Explore feature
          </span>
          <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </Card>
      </Link>
    </motion.div>
  );
}

function Features() {
  const features = [
    {
      title: "AI Career Recommendation",
      description:
        "Get personalized career suggestions based on your interests, skills, education, and goals.",
      icon: FaBrain,
      gradient: "from-blue-600 to-cyan-500",
      featured: true,
      link: "/career-test",
    },
    {
      title: "Resume Analyzer",
      description:
        "Analyze your resume and identify key areas for improvement to increase hiring callback rates.",
      icon: FaFileAlt,
      gradient: "from-purple-600 to-pink-500",
      link: "/resume-analyzer",
    },
    {
      title: "Skill Gap Analysis",
      description:
        "Discover targeted skills you need to build to qualify for your dream roles.",
      icon: FaChartLine,
      gradient: "from-emerald-600 to-teal-500",
      link: "/skill-gap",
    },
    {
      title: "Job & Internship Matching",
      description:
        "Access curated listings matched directly against your profile and skill benchmarks.",
      icon: FaBriefcase,
      gradient: "from-orange-500 to-amber-500",
      link: "/jobs",
    },
    {
      title: "AI Career Assistant",
      description:
        "Get real-time answers, advice, and actionable guidance for all career decisions.",
      icon: FaRobot,
      gradient: "from-indigo-600 to-violet-500",
      link: "/ai-assistant",
    },
    {
      title: "Interview Preparation",
      description:
        "Practice with role-specific questions, AI feedback, and structured interview strategies.",
      icon: FaBullseye,
      gradient: "from-rose-600 to-red-500",
      link: "/interview-prep",
    },
  ];

  return (
<section
  id="features"
  className="relative overflow-hidden bg-slate-50 py-24"
>      {/* Background Dot Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] opacity-60 [background-size:24px_24px]" />

      {/* Ambient Radial Gradient Backgrounds */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-blue-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-purple-300/20 blur-[120px]" />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <Badge className="mb-3 border border-blue-200 bg-blue-50 text-blue-700">
            AI Powered
          </Badge>

          <SectionTitle
            title="Everything You Need to Build Your Career"
            subtitle="Powerful AI-driven tools designed to help students discover, prepare, and achieve their career goals."
          />
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;