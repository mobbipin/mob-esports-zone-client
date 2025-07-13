import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  const location = useLocation();
  
  // Hide navbar on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-email';
  
  return (
    <div className="min-h-screen bg-[#1a1a1e] flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};