const API_URL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
  };

  if (body !== undefined) {
    const isFormData = body instanceof FormData;
    if (!isFormData) options.headers = { "Content-Type": "application/json" };
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  const data = response.status === 204 ? {} : await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return data;
}
