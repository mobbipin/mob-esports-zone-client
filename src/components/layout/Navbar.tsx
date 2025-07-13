import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, MenuIcon, XIcon, UserIcon, LogOutIcon, UserPlus, HomeIcon, TrophyIcon, NewspaperIcon, UsersIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import AuthDialog from "../ui/AuthDialog";
import classNames from "classnames";      

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState<null | "login" | "register">(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only fetch notifications if user is logged in
    if (user) {
      fetchNotifications();
      // Poll every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch<any>("/notifications");
      setNotifications(res.data || []);
    } catch {
      setNotifications([]);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      fetchNotifications();
    } catch {}
  };

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filter nav links based on user role
  const getNavLinks = () => {
    const baseLinks: Array<{ to: string; label: string; icon: React.ReactNode }> = [
      { to: "/", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
      { to: "/tournaments", label: "Tournaments", icon: <TrophyIcon className="w-5 h-5" /> },
      { to: "/news", label: "News", icon: <NewspaperIcon className="w-5 h-5" /> },
    ];

    // Only show friends for players
    if (user && user.role === "player") {
      baseLinks.push({ to: "/players", label: "Players", icon: <UsersIcon className="w-5 h-5" /> });
      baseLinks.push({ to: "/friends", label: "Friends", icon: <UserPlus className="w-5 h-5" /> });
    } else if (user && user.role !== "admin" && user.role !== "tournament_organizer") {
      baseLinks.push({ to: "/players", label: "Players", icon: <UsersIcon className="w-5 h-5" /> });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className={classNames(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-[#15151a]/95 backdrop-blur-md border-b border-[#292932]/50 shadow-lg"
        : "bg-[#15151a]"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/assets/logo.png" 
              alt="MOB Esports" 
              className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-xl font-bold text-white group-hover:text-[#f34024] transition-colors duration-200">
              MOB ESPORTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 ml-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={classNames(
                    "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#f34024] text-white shadow"
                      : "text-gray-300 hover:text-white hover:bg-[#292932]"
                  )}
                  style={isActive ? { color: '#fff', background: '#f34024' } : {}}
                >
                  {React.cloneElement(link.icon as React.ReactElement, { className: classNames("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white") })}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-[#292932] bg-transparent hover:bg-[#292932] relative"
                    onClick={() => setIsNotifOpen((v) => !v)}
                  >
                    <BellIcon className="w-4 h-4 text-white" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#19191d] rounded-lg shadow-lg border border-[#292932] z-50">
                      <div className="p-4">
                        <h3 className="text-white font-bold mb-2">Notifications</h3>
                        {notifications.length === 0 ? (
                          <div className="text-gray-400 text-sm">No notifications.</div>
                        ) : (
                          <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                              <li 
                                key={notification.id} 
                                className={`flex items-start justify-between bg-[#15151a] rounded px-3 py-2 cursor-pointer hover:bg-[#292932] transition-colors ${!notification.isRead ? 'border-l-2 border-[#f34024]' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex-1">
                                  <div className="text-white text-sm font-medium">{notification.title}</div>
                                  <div className="text-gray-400 text-xs mt-1">{notification.message}</div>
                                  <div className="text-gray-500 text-xs mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-[#f34024] rounded-full ml-2 flex-shrink-0"></div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:text-[#f34024] transition-colors"
                  >
                    <img
                      src={typeof user?.avatar === 'string' && user.avatar ? user.avatar : '/assets/logo.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block font-medium">{user.username}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#19191d] rounded-lg shadow-lg border border-[#292932] z-50">
                      <div className="py-1">
                        {/* Only show Dashboard for players */}
                        {user.role === "player" && (
                          <Link
                          
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-white hover:bg-[#292932] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
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
                        {user.role === "tournament_organizer" && (
                          <Link
                            to="/organizer"
                            className="flex items-center px-4 py-2 text-white hover:bg-[#292932] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Organizer Dashboard
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
                {isMobile ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="border-[#292932] hover:bg-[#292932]" onClick={() => setAuthDialogOpen("login")}>Login</Button>
                    <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white" onClick={() => setAuthDialogOpen("register")}>Register</Button>
                  </>
                )}
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
        <div className={classNames(
          "md:hidden fixed left-0 right-0 top-16 bg-[#19191d] border-b border-[#292932] shadow-xl transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-[400px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
        )}>
          <div className="flex flex-col px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={classNames(
                    "flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#f34024] text-white shadow"
                      : "text-gray-300 hover:text-white hover:bg-[#292932]"
                  )}
                  style={isActive ? { color: '#fff', background: '#f34024' } : {}}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {React.cloneElement(link.icon as React.ReactElement, { className: classNames("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white") })}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <AuthDialog open={!!authDialogOpen} mode={authDialogOpen} onClose={() => setAuthDialogOpen(null)} />
    </nav>
  );
};