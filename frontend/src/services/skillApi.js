import { request } from "./api";

export const skillApi = {
  getRoles: () => request("/skill-gap/roles"),
  analyzeGap: (payload) =>
    request("/skill-gap/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};