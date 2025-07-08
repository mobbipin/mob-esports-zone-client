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
  isPublic?: number;
  banned?: number; // Added banned property
  playerProfile?: {
    achievements?: string[];
    bio?: string;
    region?: string;
    gameId?: string;
    avatar?: string;
    rank?: string;
    winRate?: number;
    kills?: number;
    social?: any;
  };
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
      {user && user.banned === 1 ? (
        <div style={{ minHeight: '100vh', background: '#1a1a1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#19191d', padding: 40, borderRadius: 16, boxShadow: '0 4px 32px #0008', border: '2px solid #f34024', textAlign: 'center' }}>
            <h1 style={{ color: '#f34024', fontSize: 36, marginBottom: 24 }}>You are banned</h1>
            <p style={{ color: '#fff', fontSize: 20, marginBottom: 16 }}>If this was a mistake, please contact <a href="mailto:admin@esportszone.mobbysc.com" style={{ color: '#f34024', textDecoration: 'underline' }}>admin@esportszone.mobbysc.com</a></p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};