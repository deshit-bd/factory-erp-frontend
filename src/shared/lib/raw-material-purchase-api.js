const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Keep the fallback message when the error body is empty.
    }

    throw new Error(message);
  }

  return response.json();
}

export function getRawMaterialPurchases(search = "") {
  const searchParams = new URLSearchParams();

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const query = searchParams.toString();
  return request(`/raw-material-purchases${query ? `?${query}` : ""}`);
}

export function createRawMaterialPurchase(payload) {
  return request("/raw-material-purchases", {
    method: "POST",
    body: payload,
  });
}

export function getUploadUrl(path) {
  if (!path) {
    return "";
  }

  const apiOrigin = API_BASE_URL.replace(/\/api$/, "");
  return `${apiOrigin}${path}`;
}
