import { request } from "./api";

export const studentApi = {
  getProfile: () => request("/students/profile"),
  getDashboard: (email) => request(`/students/profile?email=${email}`),
  updateProfile: (data) =>
    request("/students/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};