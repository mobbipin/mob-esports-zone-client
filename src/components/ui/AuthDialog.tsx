import React from "react";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";

interface AuthDialogProps {
  open: boolean;
  mode: "login" | "register" | null;
  onClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, mode, onClose }) => {
  if (!open || !mode) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-lg mx-auto pointer-events-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#f34024] rounded-full p-1 z-10"
          aria-label="Close"
        >
          ×
        </button>
        <div className="bg-[#19191d] rounded-2xl shadow-2xl border border-[#292932] p-0">
          {mode === "login" ? <LoginPage /> : <RegisterPage />}
        </div>
      </div>
    </div>
  );
};

export default AuthDialog; 