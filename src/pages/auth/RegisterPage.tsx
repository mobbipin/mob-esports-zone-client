import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { validateRequired, validateEmail, validatePassword, validatePasswordMatch } from "../../lib/utils";

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player" as "player" | "tournament_organizer"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Form validation
    if (!validateRequired(formData.username, "Username")) return;
    if (!validateRequired(formData.email, "Email")) return;
    if (!validateEmail(formData.email)) return;
    if (!validateRequired(formData.password, "Password")) return;
    if (!validatePassword(formData.password)) return;
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) return;
    

    
    setLoading(true);
    try {
      await register(formData);
      // Success toast is handled by the AuthContext register function
      // Don't navigate to dashboard since user needs to verify email first
      navigate("/login");
    } catch (error: any) {
      if (error && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      }
      // Error toast is handled by the API utility
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1e]">
      <div className="w-full max-w-md p-8">
        <Skeleton height={40} width={200} className="mb-6" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} height={48} className="mb-4" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#f34024] rounded-lg flex items-center justify-center overflow-hidden">
              <img src="assets/logo.png" alt="MOB Esports Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-white font-bold text-2xl">MOB ESPORTS ZONE</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join the Competition</h1>
          <p className="text-gray-400">Create your account to start competing</p>
        </div>

        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                >
                  <option value="player">Player</option>
                  <option value="tournament_organizer">Tournament Organizer</option>
                </select>
              </div>

              {formData.role === "tournament_organizer" && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center text-blue-400 text-sm mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Tournament Organizer Account
                  </div>
                  <p className="text-blue-300 text-xs">
                    Your account will need admin approval before you can create tournaments and posts.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  placeholder="Enter your email"
                  required
                />
                {fieldErrors.email && fieldErrors.email.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white py-3"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button 
                  onClick={() => window.location.href = '/?auth=login'} 
                  className="text-[#f34024] hover:text-[#f34024]/80 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};