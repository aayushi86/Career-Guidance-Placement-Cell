const { CAREER_DOMAINS, getDomainForRole } = require("../config/careerDomains");

/**
 * Normalizes and splits text into individual key terms/words
 */
const getKeywords = (str = "") => {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && w !== "and" && w !== "for" && w !== "the");
};

/**
 * Deterministic multi-domain career score calculator
 * Measures candidate profile across Interests, Aptitude, Skills, and Work Style.
 */
function calculateCareerScore(
  selectedSkills = [],
  selectedInterests = [],
  selectedAptitudes = [],
  workStyle = "",
  preferredDomain = ""
) {
  const skills = selectedSkills.map((s) => String(s).toLowerCase().trim());
  const interests = selectedInterests.map((i) => String(i).toLowerCase().trim());
  const aptitudes = selectedAptitudes.map((a) => String(a).toLowerCase().trim());
  const normalizedWorkStyle = String(workStyle).toLowerCase().trim();
  const normalizedPrefDomain = String(preferredDomain).toLowerCase().trim();

  const results = [];

  for (const [domainName, domainObj] of Object.entries(CAREER_DOMAINS)) {
    const domainInterests = domainObj.interests.map((i) => i.toLowerCase().trim());
    const domainAptitude = domainObj.aptitude.map((a) => a.toLowerCase().trim());
    const domainWorkStyles = domainObj.workStyles.map((w) => w.toLowerCase().trim());
    const domainNameNorm = domainName.toLowerCase().trim();

    for (const [roleName, roleSkillsObj] of Object.entries(domainObj.skills)) {
      const coreSkills = (roleSkillsObj.coreSkills || []).map((s) => s.toLowerCase().trim());
      const techSkills = (roleSkillsObj.technicalSkills || []).map((s) => s.toLowerCase().trim());
      const allRoleSkills = [...coreSkills, ...techSkills];

      // 1. Skill Score (Weight: 40%)
      const matchedSkills = skills.filter((s) =>
        allRoleSkills.some((rs) => rs.includes(s) || s.includes(rs))
      );
      const skillRatio = allRoleSkills.length > 0 ? (matchedSkills.length / Math.min(allRoleSkills.length, 5)) : 0;
      const skillScore = Math.min(skillRatio * 40, 40);

      // 2. Interest Score (Weight: 30%)
      const userInterestWords = interests.flatMap((i) => getKeywords(i));
      const matchedInterests = interests.filter((i) => {
        const uWords = getKeywords(i);
        return domainInterests.some((di) => {
          const dWords = getKeywords(di);
          return uWords.some((uw) => dWords.includes(uw)) || di.includes(i) || i.includes(di);
        });
      });
      const interestRatio = domainInterests.length > 0 ? (matchedInterests.length / Math.min(domainInterests.length, 3)) : 0;
      const interestScore = Math.min(interestRatio * 30, 30);

      // 3. Aptitude Score (Weight: 15%)
      const matchedAptitudes = aptitudes.filter((a) => {
        const uWords = getKeywords(a);
        return domainAptitude.some((da) => {
          const dWords = getKeywords(da);
          return uWords.some((uw) => dWords.includes(uw)) || da.includes(a) || a.includes(da);
        });
      });
      const aptitudeRatio = domainAptitude.length > 0 ? (matchedAptitudes.length / Math.max(domainAptitude.length, 1)) : 0;
      const aptitudeScore = Math.min(aptitudeRatio * 15, 15);

      // 4. Work Style & Domain Preference Score (Weight: 15%)
      let workStyleScore = domainWorkStyles.includes(normalizedWorkStyle) ? 10 : 5;
      if (normalizedPrefDomain && domainNameNorm.includes(normalizedPrefDomain)) {
        workStyleScore += 5;
      }

      // Explicit Domain Match boost if user selected matching interest/domain
      let domainBoost = 0;
      if (
        userInterestWords.some((w) => domainNameNorm.includes(w)) ||
        (normalizedPrefDomain && domainNameNorm.includes(normalizedPrefDomain))
      ) {
        domainBoost = 15;
      }

      const totalRawScore = Math.round(
        skillScore + interestScore + aptitudeScore + workStyleScore + domainBoost
      );

      const finalScore = Math.min(Math.max(totalRawScore, 45), 98);

      results.push({
        career: roleName,
        domain: domainName,
        score: finalScore,
        matchedSkills,
        matchedInterests,
        matchedAptitudes,
      });
    }
  }

  // Sort highest score first
  results.sort((a, b) => b.score - a.score);

  // Group top domain scores
  const domainScores = {};
  results.forEach((r) => {
    if (!domainScores[r.domain] || domainScores[r.domain] < r.score) {
      domainScores[r.domain] = r.score;
    }
  });

  const domainBreakdown = Object.entries(domainScores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score);

  const topDomain = domainBreakdown[0]?.domain || "Software Development / IT";
  const topDomainScore = domainBreakdown[0]?.score || 85;

  return {
    careerResults: results,
    topCareer: results[0],
    topDomain,
    topDomainScore,
    domainBreakdown,
    recommendedCareers: results.slice(0, 4),
  };
}

module.exports = {
  calculateCareerScore,
};