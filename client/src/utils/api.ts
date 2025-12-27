const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Enhanced fetch wrapper that automatically attaches authentication token
 * to all requests that require authentication
 */
export const api = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Attach Authorization header for protected routes
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, config);

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401 && requiresAuth) {
    // Clear invalid token
    localStorage.removeItem("token");
    
    // Redirect to login page
    window.location.href = "/login";
    
    throw new Error("Session expired. Please log in again.");
  }

  return response;
};

/**
 * Helper function to handle API responses with proper error handling
 */
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Convenience methods for common HTTP operations
 */
export const apiClient = {
  get: async <T>(endpoint: string, requiresAuth = true): Promise<T> => {
    const response = await api(endpoint, {
      method: "GET",
      requiresAuth,
    });
    return handleResponse<T>(response);
  },

  post: async <T>(
    endpoint: string,
    data?: any,
    requiresAuth = true
  ): Promise<T> => {
    const response = await api(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth,
    });
    return handleResponse<T>(response);
  },

  put: async <T>(
    endpoint: string,
    data?: any,
    requiresAuth = true
  ): Promise<T> => {
    const response = await api(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth,
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(
    endpoint: string,
    data?: any,
    requiresAuth = true
  ): Promise<T> => {
    const response = await api(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      requiresAuth,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, requiresAuth = true): Promise<T> => {
    const response = await api(endpoint, {
      method: "DELETE",
      requiresAuth,
    });
    return handleResponse<T>(response);
  },
};
