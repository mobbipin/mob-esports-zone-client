import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  const location = useLocation();
  
  // Generate breadcrumbs based on current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      // Special cases
      if (segment === 'admin') label = 'Admin Panel';
      if (segment === 'organizer') label = 'Organizer Dashboard';
      if (segment === 'dashboard') label = 'Dashboard';
      if (segment === 'tournaments') label = 'Tournaments';
      if (segment === 'posts') label = 'Posts';
      if (segment === 'users') label = 'Users';
      if (segment === 'teams') label = 'Teams';
      if (segment === 'create') label = 'Create';
      if (segment === 'edit') label = 'Edit';
      if (segment === 'view') label = 'View';
      if (segment === 'pending') label = 'Pending';
      if (segment === 'manage') label = 'Manage';
      if (segment === 'profile') label = 'Profile';
      if (segment === 'friends') label = 'Friends';
      if (segment === 'notifications') label = 'Notifications';
      if (segment === 'players') label = 'Players';
      
      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0) return null;
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-white transition-colors"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="w-4 h-4" />
          {item.path ? (
            <Link 
              to={item.path}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 