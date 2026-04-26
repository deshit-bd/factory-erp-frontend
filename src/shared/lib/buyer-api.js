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
      // Keep the fallback message when the error body is empty.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getBuyers(search = "") {
  const searchParams = new URLSearchParams();

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const query = searchParams.toString();
  return request(`/buyers${query ? `?${query}` : ""}`);
}

export function createBuyer(payload) {
  return request("/buyers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBuyer(recordId, payload) {
  return request(`/buyers/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateBuyerStatus(recordId, status) {
  return request(`/buyers/${recordId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteBuyer(recordId) {
  return request(`/buyers/${recordId}`, {
    method: "DELETE",
  });
}
