export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const API_URL = `${API_BASE_URL}/api`;

function getStoredToken() {
  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("career_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt");

  if (directToken && directToken !== "null" && directToken !== "undefined") {
    return directToken;
  }

  try {
    const rawUser = localStorage.getItem("user") || localStorage.getItem("authUser");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      return parsed?.token || parsed?.data?.token || null;
    }
  } catch {
    // fallback if JSON parse fails
  }

  return null;
}

export async function request(endpoint, options = {}) {
  const token = getStoredToken();

  // Debug logging to verify token status in the browser console
  console.log(`[API Request] ${endpoint} | Token present:`, Boolean(token));

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const targetEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_URL}${targetEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}