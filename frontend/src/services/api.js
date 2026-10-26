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

/**
 * Clears all auth-related keys from localStorage.
 * Called automatically when the server returns 401 with an expired/invalid token
 * so the user is redirected to login on the next protected route visit instead of
 * getting an infinite 401 loop.
 */
function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("career_token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("jwt");
  localStorage.removeItem("authUser");
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
    // Auto-clear stale / expired tokens so the user lands on the login screen
    // rather than silently looping on 401 errors.
    if (response.status === 401) {
      const msg = (data.message || "").toLowerCase();
      if (msg.includes("expired") || msg.includes("invalid")) {
        clearStoredAuth();
      }
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
