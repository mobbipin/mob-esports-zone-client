import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  image?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  image,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {image && (
        <img 
          src={image} 
          alt="Empty state" 
          className="w-32 h-32 mb-6 opacity-50"
        />
      )}
      
      {icon && (
        <div className="w-16 h-16 mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Predefined empty states for common use cases
export const EmptyTournaments: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    title="No tournaments found"
    description="There are no tournaments available at the moment. Check back later or create your own tournament."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    }
    action={onCreate ? {
      label: "Create Tournament",
      onClick: onCreate
    } : undefined}
  />
);

export const EmptyTeams: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    title="No teams found"
    description="You haven't joined or created any teams yet. Create a team to start competing in tournaments."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    }
    action={onCreate ? {
      label: "Create Team",
      onClick: onCreate
    } : undefined}
  />
);

export const EmptyFriends: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    title="No friends yet"
    description="Connect with other players to build your network and find teammates for tournaments."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      </svg>
    }
    action={onAdd ? {
      label: "Add Friends",
      onClick: onAdd
    } : undefined}
  />
);

export const EmptyNotifications: React.FC = () => (
  <EmptyState
    title="No notifications"
    description="You're all caught up! Check back later for updates on tournaments, team invites, and more."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    }
  />
);

export const EmptySearch: React.FC<{ query: string }> = ({ query }) => (
  <EmptyState
    title={`No results for "${query}"`}
    description="Try adjusting your search terms or browse our categories to find what you're looking for."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    }
  />
);

export const EmptyPosts: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    title="No posts yet"
    description="Be the first to share news, updates, or announcements with the community."
    icon={
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    }
    action={onCreate ? {
      label: "Create Post",
      onClick: onCreate
    } : undefined}
  />
); 