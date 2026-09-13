const { CAREER_DOMAINS } = require("./careerDomains");

// Flatten all role skill objects across all multi-domain definitions into ROLE_REQUIREMENTS
const ROLE_REQUIREMENTS = {};

Object.values(CAREER_DOMAINS).forEach((domainObj) => {
  if (domainObj.skills) {
    Object.entries(domainObj.skills).forEach(([roleName, skillsObj]) => {
      ROLE_REQUIREMENTS[roleName] = skillsObj;
    });
  }
});

// Fallback defaults for legacy role keys
if (!ROLE_REQUIREMENTS["Software Engineer"]) {
  ROLE_REQUIREMENTS["Software Engineer"] = ROLE_REQUIREMENTS["Software Developer"];
}

module.exports = ROLE_REQUIREMENTS;