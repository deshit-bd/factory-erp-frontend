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

export function getSupplierAssignments(search = "") {
  const searchParams = new URLSearchParams();

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const query = searchParams.toString();
  return request(`/supplier-assignments${query ? `?${query}` : ""}`);
}

export function createSupplierAssignment(payload) {
  return request("/supplier-assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSupplierAssignmentStatus(recordId, status) {
  return request(`/supplier-assignments/${recordId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
