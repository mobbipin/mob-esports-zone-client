import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../lib/api";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "player" | "admin" | "tournament_organizer";
  avatar?: string;
  gameUsername?: string;
  region?: string;
  bio?: string;
  rank?: string;
  teamId?: string;
  isPublic?: number;
  banned?: number; // Added banned property
  emailVerified?: boolean; // Added email verification status
  isApproved?: boolean; // Added approval status for tournament organizers
  displayName?: string; // Added displayName for consistency
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
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Partial<User> & { password: string; adminCode?: string; displayName?: string }) => Promise<any>;
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
      }, true, false); // Don't show error toast here, handle it in component
      
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      
      // Show appropriate message based on user role and status
      if (res.data.user.role === 'tournament_organizer' && !res.data.user.isApproved) {
        toast.success("Login successful! Your account is pending admin approval. You can browse but cannot create tournaments or posts yet.");
      } else {
        toast.success("Login successful!");
      }
      
      // Return user data for navigation logic
      return res.data.user;
    } catch (error: any) {
      // Check if account is deleted
      if (error?.accountDeleted) {
        throw { accountDeleted: true, message: error.error };
      }
      throw new Error(typeof error === "string" ? error : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string; adminCode?: string; displayName?: string }) => {
    setLoading(true);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }, true, true); // Show error toast here
      
      // Show success message based on role
      if (userData.role === 'tournament_organizer') {
        toast.success("Account created successfully! Your account is pending admin approval. You'll be notified when approved.");
      } else {
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
      
      // Return the response so the component can handle navigation
      return response;
    } catch (error) {
      throw new Error(typeof error === "string" ? error : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setLoading(true);
      try {
        // Update user profile (player)
        await apiFetch(`/players/${user.id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        }, true, false, false); // Don't show error toast here, let the component handle it
        // Refetch user profile
        const res = await apiFetch<{ status: boolean; data: User }>("/auth/me");
        setUser(res.data);
        toast.success("Profile updated successfully!");
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