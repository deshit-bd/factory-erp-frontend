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

export function getSalesOrders(search = "") {
  const searchParams = new URLSearchParams();

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const query = searchParams.toString();
  return request(`/sales-orders${query ? `?${query}` : ""}`);
}

export function createSalesOrder(payload) {
  return request("/sales-orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteSalesOrder(recordId) {
  return request(`/sales-orders/${recordId}`, {
    method: "DELETE",
  });
}

export function updateSalesOrderStatus(recordId, status) {
  return request(`/sales-orders/${recordId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
