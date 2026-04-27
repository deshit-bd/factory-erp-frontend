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

  return response.json();
}

export function getProjectGoodsSupplierPayments() {
  return request("/project-goods-supplier-payments");
}

export function createProjectGoodsSupplierPayment(payload) {
  return request("/project-goods-supplier-payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
