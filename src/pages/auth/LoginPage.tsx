import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      await login(email, password);
      addToast("Login successful!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      if (error && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        addToast("Login failed. Please check your credentials.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1e]">
      <div className="w-full max-w-md p-8">
        <Skeleton height={40} width={200} className="mb-6" />
        <Skeleton height={48} className="mb-4" />
        <Skeleton height={48} className="mb-4" />
        <Skeleton height={48} className="mb-4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#f34024] rounded-lg flex items-center justify-center overflow-hidden">
              <img src="assets/logo.png" alt="MOB Esports Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-white font-bold text-2xl">MOB ESPORTS ZONE</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] pr-10"
                    placeholder="Enter your password"
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
                {fieldErrors.password && fieldErrors.password.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white py-3"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#f34024] hover:text-[#f34024]/80 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-[#19191d] rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Demo Accounts:</p>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Player: player@demo.com / password</div>
                <div>Admin: admin@demo.com / password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};