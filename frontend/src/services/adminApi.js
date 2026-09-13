import { request } from "./api";

export const adminApi = {
  getStats: () => request("/admin/stats"),
  getRecruiters: () => request("/admin/recruiters"),
  verifyRecruiter: (id, status) =>
    request(`/admin/recruiters/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getStudents: () => request("/admin/students"),
  deleteStudent: (id) =>
    request(`/admin/students/${id}`, {
      method: "DELETE",
    }),
  getJobs: () => request("/admin/jobs"),
  toggleJobStatus: (id, status) =>
    request(`/admin/jobs/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteJob: (id) =>
    request(`/admin/jobs/${id}`, {
      method: "DELETE",
    }),
  getApplications: () => request("/admin/applications"),
  getAnalytics: () => request("/admin/analytics"),
  sendAnnouncement: (data) =>
    request("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
