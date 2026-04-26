const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

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

export function getSupplierProductsTracking() {
  return request("/supplier-products-tracking");
}

export function createSupplierProductsTracking(payload) {
  return request("/supplier-products-tracking", {
    method: "POST",
    body: payload,
  });
}

export function updateSupplierProductsTracking(recordId, payload) {
  return request(`/supplier-products-tracking/${recordId}`, {
    method: "PUT",
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
