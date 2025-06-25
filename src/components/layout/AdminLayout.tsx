import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  TrophyIcon, 
  NewspaperIcon, 
  MenuIcon,
  XIcon,
  LogOutIcon
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { to: "/admin", icon: HomeIcon, label: "Dashboard", exact: true },
    { to: "/admin/users", icon: UsersIcon, label: "Users" },
    { to: "/admin/teams", icon: UsersIcon, label: "Teams" },
    { to: "/admin/tournaments", icon: TrophyIcon, label: "Tournaments" },
    { to: "/admin/posts", icon: NewspaperIcon, label: "Posts" },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#15151a] border-r border-[#292932] transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#292932]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#f34024] rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/assets/logo.png" alt="MOB Esports Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-white font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-[#f34024]"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.to, item.exact)
                        ? "bg-[#f34024] text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#292932]"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-3 px-3 py-2 bg-[#292932] rounded-lg">
            <img
              src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.username}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-[#15151a] border-b border-[#292932] h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-white hover:text-[#f34024]"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" className="border-[#292932] hover:bg-[#292932]">
                View Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};