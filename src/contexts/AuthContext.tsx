import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "../lib/api";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "player" | "admin";
  avatar?: string;
  gameUsername?: string;
  region?: string;
  bio?: string;
  rank?: string;
  teamId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string; adminCode?: string; displayName?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user profile
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch<{ status: boolean; data: User }>("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        status: boolean;
        data: { token: string; user: User };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (error) {
      throw new Error(typeof error === "string" ? error : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string; adminCode?: string; displayName?: string }) => {
    setLoading(true);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      // Optionally, auto-login after registration
      await login(userData.email || "", userData.password);
    } catch (error) {
      throw new Error(typeof error === "string" ? error : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setLoading(true);
      try {
        // Update user profile (player)
        await apiFetch(`/players/${user.id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        });
        // Refetch user profile
        const res = await apiFetch<{ status: boolean; data: User }>("/auth/me");
        setUser(res.data);
      } catch (error) {
        throw new Error(typeof error === "string" ? error : "Update failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const setUserData = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};