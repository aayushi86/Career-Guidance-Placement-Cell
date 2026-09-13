import { request } from "./api";

export const careerApi = {
  // Career assessment methods
  submitTest: (formData) =>
    request("/career-test", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  getResults: (email) =>
    request(`/career/results?email=${encodeURIComponent(email || "")}`),

  // Job & recommendation methods
  getRecommendedJobs: (careerTitle) =>
    request(`/jobs/recommendations?career=${encodeURIComponent(careerTitle || "")}`),

  // Application methods
  applyJob: (payload) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyApplications: (email) =>
    request(`/applications/student/${encodeURIComponent(email || "")}`),
};