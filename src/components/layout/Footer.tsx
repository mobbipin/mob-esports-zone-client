import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#15151a] border-t border-[#292932] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#f34024] rounded-lg flex items-center justify-center overflow-hidden">
                <img src="assets/logo.png" alt="MOB Esports Logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-white font-bold text-xl">MOB ESPORTS ZONE</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              The ultimate destination for competitive esports. Join tournaments, 
              build teams, and compete with players from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tournaments" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-white transition-colors text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Join Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@mobesports.com</li>
              <li>Discord: MOB Esports</li>
              <li>Twitter: @MOBEsports</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#292932] mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 MOB ESPORTS ZONE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};