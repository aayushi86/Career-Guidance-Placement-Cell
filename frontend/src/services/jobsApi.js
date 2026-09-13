import { request } from "./api";

export const jobsApi = {
  // Aliases to satisfy both getAll and getJobs calls across components
  getAll: () => request("/jobs"),
  getJobs: () => request("/jobs"),
  getJobById: (id) => request(`/jobs/${id}`),
  getRecommendedJobs: () => request("/jobs/recommended"),
  getJobMatch: (id) => request(`/jobs/${id}/match`),
  applyJob: (payload) =>
    request("/jobs/apply", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};