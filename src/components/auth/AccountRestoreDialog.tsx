import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";

interface AccountRestoreDialogProps {
  email: string;
  onClose: () => void;
  onRestoreSuccess: () => void;
  visible?: boolean;
}

export const AccountRestoreDialog: React.FC<AccountRestoreDialogProps> = ({
  email,
  onClose,
  onRestoreSuccess,
  visible = true
}) => {
  const [step, setStep] = useState<'confirm' | 'otp'>('confirm');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await apiFetch('/auth/send-restore-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      }, true, false, false);
      
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreAccount = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/auth/restore-account', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      }, true, false, false);
      
      toast.success('Account restored successfully! You can now login.');
      onRestoreSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore account');
    } finally {
      setLoading(false);
    }
  };

  return visible ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#19191d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#292932]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg text-white font-semibold">Restore Account</div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        {step === 'confirm' ? (
          <div className="text-white mb-4">
            <p className="mb-4">Your account has been deleted. Would you like to restore it?</p>
            <p className="text-sm text-gray-400 mb-4">We'll send an OTP to your email to verify your identity.</p>
            <div className="flex justify-end gap-3">
              <Button onClick={onClose} variant="outline" className="border-[#292932] text-black hover:text-white hover:bg-[#292932]">
                Cancel
              </Button>
              <Button 
                onClick={handleSendOTP}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-white mb-4">
            <p className="mb-4">Enter the OTP sent to your email:</p>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full bg-[#15151a] border-[#292932] text-white focus:border-[#f34024] mb-4"
              maxLength={6}
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setStep('confirm')} variant="outline" className="border-[#292932] text-black hover:text-white hover:bg-[#292932]">
                Back
              </Button>
              <Button 
                onClick={handleRestoreAccount}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Restoring..." : "Restore Account"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}; 