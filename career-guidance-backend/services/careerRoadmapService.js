const { getRoadmapForRole } = require("../config/careerDomains");

function getCareerRoadmap(career) {
  return getRoadmapForRole(career);
}

module.exports = {
  getCareerRoadmap,
};