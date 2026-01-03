import type {
  ReactNode,
} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../services/auth.service";

export type Role = "CREATOR" | "CLIPPER";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Restore auth state on page refresh
   */
  useEffect(() => {
    const restoreAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    restoreAuth();
  }, []);

  /**
   * Login handler
   */
  const login = (token: string, user: User) => {
    authService.login(token, user);
    setToken(token);
    setUser(user);
  };

  /**
   * Logout handler
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
