import { apiClient } from "../utils/api";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CREATOR" | "CLIPPER";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "CREATOR" | "CLIPPER";
  };
  token: string;
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/signup", data, false);
  },

  async loginRequest(data: LoginData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", data, false);
  },

  login(token: string, user: AuthResponse['user']): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
