const Student = require("../models/Student");
const CareerTest = require("../models/CareerTest");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const CareerRoadmap = require("../models/CareerRoadmap");
const Job = require("../models/Job");
const User = require("../models/User");
const { getDomainForRole } = require("../config/careerDomains");

/**
 * Normalizes text string or array into lowercased trimmed strings
 */
const normalizeList = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((item) => String(item).toLowerCase().trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.toLowerCase().trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Fetch and aggregate student profile across models
 */
const getStudentProfileData = async (user) => {
  const email = (user?.email || "").toLowerCase().trim();
  const userId = user?._id || user?.id;

  const [studentProfile, careerTest, resumeAnalysis, roadmap] = await Promise.all([
    Student.findOne({ email }).lean(),
    CareerTest.findOne({ email }).sort({ createdAt: -1 }).lean(),
    userId
      ? ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }).lean()
      : ResumeAnalysis.findOne({ userEmail: email }).sort({ createdAt: -1 }).lean(),
    userId ? CareerRoadmap.findOne({ userId }).sort({ createdAt: -1 }).lean() : null,
  ]);

  // Skill Aggregation
  const skillsSet = new Set();
  normalizeList(studentProfile?.skills).forEach((s) => skillsSet.add(s));
  normalizeList(careerTest?.skills).forEach((s) => skillsSet.add(s));
  normalizeList(resumeAnalysis?.matchedSkills).forEach((s) => skillsSet.add(s));
  normalizeList(roadmap?.currentSkills).forEach((s) => skillsSet.add(s));
  if (user?.skills) normalizeList(user.skills).forEach((s) => skillsSet.add(s));

  const studentSkills = Array.from(skillsSet);

  // Education / Degree
  const degree = (
    studentProfile?.degree ||
    studentProfile?.education ||
    careerTest?.education ||
    "B.Sc IT / B.Tech CSE"
  ).trim();

  // Target Role / Recommended Career & Domain
  const targetRole = (
    studentProfile?.targetRole ||
    careerTest?.recommendedCareer ||
    careerTest?.topRecommendation ||
    resumeAnalysis?.targetRole ||
    roadmap?.targetRole ||
    "Software Developer"
  ).trim();

  const targetDomain = getDomainForRole(targetRole);

  const interests = normalizeList(studentProfile?.interests || careerTest?.interests);
  const preferredWorkStyle = studentProfile?.preferredWorkStyle || careerTest?.preferredWorkStyle || "Analytical";
  const atsScore = typeof resumeAnalysis?.atsScore === "number" ? resumeAnalysis.atsScore : null;
  const roadmapProgress = roadmap?.progress?.overallProgress || 0;
  const readinessScore = studentProfile?.readinessScore || roadmap?.readinessScore || 75;

  return {
    studentProfile,
    careerTest,
    resumeAnalysis,
    roadmap,
    studentSkills,
    degree,
    targetRole,
    targetDomain,
    interests,
    preferredWorkStyle,
    atsScore,
    roadmapProgress,
    readinessScore,
  };
};

/**
 * Calculates matching score & eligibility for a specific job & student
 * PRESERVES EXACT WEIGHTS:
 * 1. Skill Match (40%)
 * 2. Career Role Match (25%)
 * 3. Education Eligibility (15%)
 * 4. Career Test Match (10%)
 * 5. Resume/ATS Match (5%)
 * 6. Roadmap Readiness (5%)
 * TOTAL = 100%
 */
const calculateJobMatch = async (user, job) => {
  const profile = await getStudentProfileData(user);

  const reqSkills = normalizeList(job.requiredSkills);
  const eligibleBranches = normalizeList(job.eligibleBranches);
  const jobTitleNorm = (job.title || "").toLowerCase().trim();
  const jobDomainNorm = (job.domain || getDomainForRole(job.title)).toLowerCase().trim();
  const studentRoleNorm = profile.targetRole.toLowerCase().trim();
  const studentDomainNorm = profile.targetDomain.toLowerCase().trim();

  // 1. Skill Match (Weight: 40%)
  let skillMatchScore = 100;
  const matchedSkills = [];
  const missingSkills = [];

  if (reqSkills.length > 0) {
    reqSkills.forEach((reqSkill) => {
      const isMatched = profile.studentSkills.some(
        (stSkill) => stSkill.includes(reqSkill) || reqSkill.includes(stSkill)
      );
      if (isMatched) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    skillMatchScore = Math.round((matchedSkills.length / reqSkills.length) * 100);
  }

  // 2. Multi-Domain Career Role Match (Weight: 25%)
  let careerMatchScore = 40;

  if (jobTitleNorm.includes(studentRoleNorm) || studentRoleNorm.includes(jobTitleNorm)) {
    careerMatchScore = 100;
  } else if (jobDomainNorm === studentDomainNorm) {
    careerMatchScore = 85;
  } else if (
    (studentRoleNorm.includes("data") && jobTitleNorm.includes("data")) ||
    (studentRoleNorm.includes("developer") && jobTitleNorm.includes("developer")) ||
    (studentRoleNorm.includes("analyst") && jobTitleNorm.includes("analyst")) ||
    (studentRoleNorm.includes("marketing") && jobTitleNorm.includes("marketing")) ||
    (studentRoleNorm.includes("hr") && jobTitleNorm.includes("recruiter")) ||
    (studentRoleNorm.includes("finance") && jobTitleNorm.includes("account"))
  ) {
    careerMatchScore = 80;
  } else if (
    studentRoleNorm.includes("engineer") ||
    studentRoleNorm.includes("analyst") ||
    studentRoleNorm.includes("executive") ||
    studentRoleNorm.includes("specialist")
  ) {
    careerMatchScore = 60;
  }

  // 3. Education Eligibility (Weight: 15%)
  let eduScore = 100;
  const studentDegreeNorm = profile.degree.toLowerCase();

  if (eligibleBranches.length > 0) {
    const isBranchMatch = eligibleBranches.some(
      (b) => studentDegreeNorm.includes(b) || b.includes(studentDegreeNorm) || b.includes("any") || b.includes("all")
    );

    if (isBranchMatch) {
      eduScore = 100;
    } else if (
      (studentDegreeNorm.includes("it") || studentDegreeNorm.includes("cs") || studentDegreeNorm.includes("tech")) &&
      eligibleBranches.some((b) => b.includes("it") || b.includes("cs") || b.includes("tech"))
    ) {
      eduScore = 80;
    } else {
      eduScore = 50;
    }
  }

  // 4. Career Test Match (Weight: 10%)
  let careerTestScore = profile.careerTest ? 85 : 60;
  if (profile.careerTest?.recommendedCareer) {
    const recNorm = profile.careerTest.recommendedCareer.toLowerCase();
    if (jobTitleNorm.includes(recNorm) || recNorm.includes(jobTitleNorm)) {
      careerTestScore = 100;
    } else if (jobDomainNorm === getDomainForRole(recNorm).toLowerCase()) {
      careerTestScore = 90;
    }
  }

  // 5. Resume ATS Match (Weight: 5%)
  let resumeScore = profile.atsScore !== null ? profile.atsScore : 70;

  // 6. Roadmap Readiness (Weight: 5%)
  let roadmapScore = profile.roadmapProgress > 0 ? profile.roadmapProgress : profile.readinessScore;

  // Exact Deterministic Weighted Overall Score
  const weightedScore = Math.round(
    skillMatchScore * 0.40 +
    careerMatchScore * 0.25 +
    eduScore * 0.15 +
    careerTestScore * 0.10 +
    resumeScore * 0.05 +
    roadmapScore * 0.05
  );

  const finalMatchScore = Math.min(Math.max(weightedScore, 0), 100);

  // Determine Eligibility
  const isJobClosed = job.status === "Closed" || job.status === "closed";
  const now = new Date();
  const isDeadlinePassed = job.deadline ? new Date(job.deadline) < now : false;
  const isExpired = job.expiryDate ? new Date(job.expiryDate) < now : false;

  let eligibility = "ELIGIBLE";
  if (isJobClosed || isDeadlinePassed || isExpired || eduScore < 50) {
    eligibility = "NOT ELIGIBLE";
  } else if (skillMatchScore < 50 || eduScore < 100) {
    eligibility = "PARTIALLY MATCHED";
  }

  // Explainability Bullet Points
  const explanation = [];
  if (matchedSkills.length > 0) {
    const displayMatched = matchedSkills.map((s) => s.toUpperCase()).join(", ");
    explanation.push(`✓ Matched Skills: ${displayMatched}`);
  } else if (reqSkills.length === 0) {
    explanation.push("✓ Standard technical foundation required.");
  } else {
    explanation.push("• Core skill prerequisites pending.");
  }

  if (careerMatchScore >= 80) {
    explanation.push(`✓ Target Role Aligned (${profile.targetRole})`);
  } else {
    explanation.push(`• Domain: ${job.domain || "General"} (${job.title})`);
  }

  if (eduScore >= 80) {
    explanation.push(`✓ Academic Branch Eligible (${profile.degree})`);
  }

  if (missingSkills.length > 0) {
    const displayMissing = missingSkills.map((s) => s.toUpperCase()).join(", ");
    explanation.push(`Missing: ${displayMissing}`);
  }

  let learningRecommendation = "";
  if (missingSkills.length > 0) {
    learningRecommendation = `Complete foundational learning in ${missingSkills.slice(0, 2).map((s) => s.toUpperCase()).join(" and ")} to maximize your placement suitability.`;
  } else {
    learningRecommendation = `You meet all core skill prerequisites for ${job.company}. Prepare for technical interview rounds.`;
  }

  return {
    job,
    matchScore: finalMatchScore,
    skillMatchScore,
    careerMatchScore,
    eduScore,
    eligibility,
    matchedSkills: matchedSkills.map((s) => s.toUpperCase()),
    missingSkills: missingSkills.map((s) => s.toUpperCase()),
    explanation,
    learningRecommendation,
    studentProfile: {
      degree: profile.degree,
      targetRole: profile.targetRole,
      targetDomain: profile.targetDomain,
      atsScore: profile.atsScore,
      skills: profile.studentSkills,
    },
  };
};

/**
 * Returns sorted recommendations across all legitimate active & non-expired jobs for a student
 * Enforces dynamic approved recruiter + expiry filtering.
 */
const getRecommendedJobsForStudent = async (user) => {
  const approvedUsers = await User.find({
    $or: [
      { role: "recruiter", verificationStatus: "approved" },
      { role: "admin" },
    ],
  }).select("email").lean();

  const approvedRecruiterEmails = approvedUsers
    .map((u) => (u.email ? u.email.toLowerCase().trim() : ""))
    .filter(Boolean);

  const now = new Date();

  const activeJobs = await Job.find({
    status: { $in: ["Active", "active"] },
    recruiterEmail: { $in: approvedRecruiterEmails },
    $and: [
      { $or: [{ deadline: { $exists: false } }, { deadline: null }, { deadline: { $gte: now } }] },
      { $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: now } }] },
    ],
  }).sort({ createdAt: -1 }).lean();

  if (!activeJobs || activeJobs.length === 0) {
    return [];
  }

  const recommendations = await Promise.all(
    activeJobs.map(async (job) => {
      const matchDetails = await calculateJobMatch(user, job);
      return matchDetails;
    })
  );

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};

module.exports = {
  calculateJobMatch,
  getRecommendedJobsForStudent,
  getStudentProfileData,
};
