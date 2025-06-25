import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, MenuIcon, XIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tournaments", label: "Tournaments" },
    { to: "/news", label: "News" },
  ];

  return (
    <nav className="bg-[#15151a] border-b border-[#292932]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#f34024] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-white font-bold text-xl">MOB ESPORTS ZONE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-[#f34024] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-[#292932] bg-transparent hover:bg-[#292932]"
                >
                  <BellIcon className="w-4 h-4 text-white" />
                </Button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:text-[#f34024] transition-colors"
                  >
                    <img
                      src={user.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block font-medium">{user.username}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#19191d] rounded-lg shadow-lg border border-[#292932] z-50">
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-white hover:bg-[#292932] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-white hover:bg-[#292932] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-white hover:bg-[#292932] transition-colors"
                        >
                          <LogOutIcon className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" className="border-[#292932] hover:bg-[#292932]">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-[#f34024] transition-colors"
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#292932]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-white hover:text-[#f34024] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};