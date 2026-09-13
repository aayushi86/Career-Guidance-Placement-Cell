import { request } from "./api";

export const applicationApi = {
  getUserApplications: (email) => request(`/applications/user/${email}`),
  applyJob: (payload) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};