import { request } from "./api";

export const recruiterApi = {
  getDashboard: () =>
    request("/recruiter/dashboard"),

  getJobs: () =>
    request("/recruiter/jobs"),

  getApplications: (jobId) =>
    request(`/recruiter/applications${jobId && jobId !== "all" ? `?jobId=${jobId}` : ""}`),

  updateProfile: (profileData) =>
    request("/recruiter/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    }),

  postJob: (jobData) =>
    request("/recruiter/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),

  updateJob: (jobId, jobData) =>
    request(`/recruiter/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    }),

  closeJob: (jobId) =>
    request(`/recruiter/jobs/${jobId}/close`, {
      method: "PATCH",
    }),

  updateStatus: (appId, payload) =>
    request(
      `/recruiter/applications/${appId}/status`,
      {
        method: "PUT",
        body: JSON.stringify(
          typeof payload === "string"
            ? { status: payload }
            : payload
        ),
      }
    ),
};