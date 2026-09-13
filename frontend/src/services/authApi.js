import { request } from "./api";

export const authApi = {
  sendOtp: (email) =>
    request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (payload) =>
    request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};