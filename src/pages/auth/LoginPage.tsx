import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { validateRequired, validateEmail } from "../../lib/utils";
import { AccountRestoreDialog } from "../../components/auth/AccountRestoreDialog";
import toast from "react-hot-toast";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [forceDialog, setForceDialog] = useState(false);
  const dialogRef = useRef(false);

  // Check if we need to show dialog on mount
  React.useEffect(() => {
    const shouldShowDialog = localStorage.getItem('showRestoreDialog');
    const restoreEmail = localStorage.getItem('restoreEmail');
    if (shouldShowDialog === 'true' && restoreEmail) {
      setEmail(restoreEmail);
      setShowRestoreDialog(true);
      setForceDialog(true);
      dialogRef.current = true;
      localStorage.removeItem('showRestoreDialog');
      localStorage.removeItem('restoreEmail');
    }
  }, []);

  console.log('Current showRestoreDialog state:', showRestoreDialog);
  console.log('Current dialogRef state:', dialogRef.current);
  console.log('Current forceDialog state:', forceDialog);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Form validation
    if (!validateRequired(email, "Email")) return;
    if (!validateEmail(email)) return;
    if (!validateRequired(password, "Password")) return;
    
    setLoading(true);

    try {
      const user = await login(email, password);
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate("/admin");
      } else if (user.role === 'tournament_organizer') {
        navigate("/organizer");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log('LoginPage received error:', error);
      console.log('Error accountDeleted:', error?.accountDeleted);
      
      if (error?.accountDeleted) {
        console.log('Setting showRestoreDialog to true');
        // Store in localStorage to ensure it persists
        localStorage.setItem('showRestoreDialog', 'true');
        localStorage.setItem('restoreEmail', email);
        // Set the email for the restore dialog and force immediate update
        dialogRef.current = true;
        setShowRestoreDialog(true);
        setForceDialog(true);
        // Force a re-render by updating a different state
        setFieldErrors({}); // This will trigger a re-render
        
        // Also use a callback to ensure the dialog shows
        setTimeout(() => {
          console.log('Forcing dialog to show via setTimeout');
          setShowRestoreDialog(true);
          setForceDialog(true);
          dialogRef.current = true;
        }, 100);
      } else if (error && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        // Show error toast for other errors
        console.error('Login error:', error);
        toast.error(error?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showRestoreDialog && !dialogRef.current && !forceDialog) return (
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
            <img src="assets/logo.png" alt="MOB Esports Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <Card className="bg-[#15151a] border-[#292932] hover:border-[#f34024] transition-all duration-300 hover:shadow-lg hover:shadow-[#f34024]/10" hover>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email Address"
                  leftIcon={<MailIcon className="w-4 h-4" />}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  placeholder="Enter your email"
                  error={fieldErrors.email?.[0]}
                  required
                />
              </div>

              <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  leftIcon={<LockIcon className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  }
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  placeholder="Enter your password"
                  error={fieldErrors.password?.[0]}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white py-3"
                size="lg"
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
          </CardContent>
        </Card>
      </div>
      
      <AccountRestoreDialog
        key={`restore-dialog-${showRestoreDialog}-${dialogRef.current}-${forceDialog}`}
        email={email}
        onClose={() => {
          setShowRestoreDialog(false);
          dialogRef.current = false;
          setForceDialog(false);
        }}
        onRestoreSuccess={() => {
          setShowRestoreDialog(false);
          dialogRef.current = false;
          setForceDialog(false);
          setPassword('');
        }}
        visible={showRestoreDialog || dialogRef.current || forceDialog}
      />
    </div>
  );
};