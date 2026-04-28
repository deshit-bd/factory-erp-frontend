const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Keep fallback message if the response body is empty.
    }

    throw new Error(message);
  }

  return response.json();
}

export function getAccountsDashboard() {
  return request("/accounts/dashboard");
}

export function getCompanyInfo() {
  return request("/accounts/company-info");
}

export function saveCompanyInfo(payload) {
  return request("/accounts/company-info", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
