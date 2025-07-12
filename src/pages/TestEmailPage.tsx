import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { apiFetch } from '../lib/api';
import toast from 'react-hot-toast';

export const TestEmailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const testVerificationEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/test/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }, true, false); // Don't show error toast here
      toast.success('Test verification email sent! Check the console for preview URL.');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Failed to send test email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testPasswordResetEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/test/send-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email })
      }, true, false); // Don't show error toast here
      toast.success('Test password reset email sent! Check the console for preview URL.');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Failed to send test email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-[#15151a] border-[#292932]">
          <CardHeader>
            <CardTitle className="text-white">Email Testing (Development Only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Enter email to test"
                className="bg-[#19191d] border-[#292932] text-white"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={testVerificationEmail}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Sending...' : 'Test Verification Email'}
              </Button>
              
              <Button
                onClick={testPasswordResetEmail}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Sending...' : 'Test Password Reset Email'}
              </Button>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-medium mb-2">Development Notes:</h3>
              <ul className="text-yellow-300 text-sm space-y-1">
                <li>• This page is only available in development mode</li>
                <li>• Emails are sent using Ethereal Email (fake SMTP)</li>
                <li>• Check the server console for email preview URLs</li>
                <li>• No real emails are sent in development</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 