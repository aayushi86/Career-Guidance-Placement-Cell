import { API_URL } from "./api";

export const resumeApi = {
  analyze: (formData) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("career_token") ||
      localStorage.getItem("authToken");

    return fetch(`${API_URL}/resumes/analyze`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Resume analysis failed."
        );
      }

      return data;
    }),
};