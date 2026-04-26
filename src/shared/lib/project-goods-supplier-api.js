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

export function getProjectGoodsSuppliers(search = "") {
  const searchParams = new URLSearchParams();

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const query = searchParams.toString();
  return request(`/project-goods-suppliers${query ? `?${query}` : ""}`);
}

export function createProjectGoodsSupplier(payload) {
  return request("/project-goods-suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProjectGoodsSupplier(recordId, payload) {
  return request(`/project-goods-suppliers/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProjectGoodsSupplier(recordId) {
  return request(`/project-goods-suppliers/${recordId}`, {
    method: "DELETE",
  });
}
