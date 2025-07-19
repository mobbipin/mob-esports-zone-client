import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No verification token found');
      setVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await apiFetch('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token })
        }, true, false, false);
        setSuccess(true);
        toast.success('Email verified successfully!');
        
        // Refresh user data to update emailVerified status
        try {
          const userRes = await apiFetch<{ status: boolean; data: any }>('/auth/me');
          setUserData(userRes.data);
        } catch (userErr) {
          console.error('Failed to refresh user data:', userErr);
        }
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : 'Verification failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    // Get the updated user data to determine the correct dashboard
    apiFetch<{ status: boolean; data: any }>('/auth/me')
      .then((userRes) => {
        const user = userRes.data;
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'tournament_organizer') {
          navigate('/organizer');
        } else {
          navigate('/dashboard');
        }
      })
      .catch(() => {
        // Fallback to dashboard if user data fetch fails
        navigate('/dashboard');
      });
  };

  const handleResend = () => {
    navigate('/');
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
        <Card className="bg-[#15151a] border-[#292932] w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f34024] mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Email</h2>
            <p className="text-gray-400">Please wait while we verify your email address...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
      <Card className="bg-[#15151a] border-[#292932] w-full max-w-md">
        <CardContent className="p-8 text-center">
          {success ? (
            <>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-6">
                Your email has been successfully verified. You can now create teams and register for tournaments.
              </p>
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
              >
                Continue to Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-6">
                {error || 'Unable to verify your email. The link may be expired or invalid.'}
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleResend}
                  className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                >
                  Go to Login
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-[#292932] hover:text-white hover:bg-[#292932]"
                >
                  Go Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 