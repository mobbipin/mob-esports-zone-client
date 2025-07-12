import React from "react";
import { XIcon, PlusIcon, EditIcon, TrashIcon, CalendarIcon, UsersIcon, TrophyIcon } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

interface PendingContentDialogProps {
  open: boolean;
  onClose: () => void;
  content: any; // Tournament or Post
  contentType: 'tournament' | 'post';
}

export const PendingContentDialog: React.FC<PendingContentDialogProps> = ({
  open,
  onClose,
  content,
  contentType
}) => {
  if (!open || !content) return null;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <PlusIcon className="w-5 h-5 text-green-500" />;
      case 'update':
        return <EditIcon className="w-5 h-5 text-blue-500" />;
      case 'delete':
        return <TrashIcon className="w-5 h-5 text-red-500" />;
      default:
        return <PlusIcon className="w-5 h-5" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create':
        return 'Create New';
      case 'update':
        return 'Update';
      case 'delete':
        return 'Delete';
      default:
        return 'Create';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-500';
      case 'update':
        return 'text-blue-500';
      case 'delete':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderTournamentContent = () => (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
        {getActionIcon(content.action)}
        <div>
          <h3 className={`text-lg font-semibold ${getActionColor(content.action)}`}>
            {getActionText(content.action)} Tournament
          </h3>
          <p className="text-gray-400 text-sm">
            Submitted by {content.organizerName || 'Unknown'} on {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tournament Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Tournament Information</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{content.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Game:</span>
                <span className="text-white ml-2">{content.game}</span>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2 capitalize">{content.type}</span>
              </div>
              <div>
                <span className="text-gray-400">Max Teams:</span>
                <span className="text-white ml-2">{content.maxTeams}</span>
              </div>
              <div>
                <span className="text-gray-400">Prize Pool:</span>
                <span className="text-[#f34024] ml-2">
                  ${content.prizePool?.toLocaleString() || 'TBA'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Entry Fee:</span>
                <span className="text-white ml-2">
                  ${content.entryFee?.toLocaleString() || 'Free'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Schedule</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-400">Start Date</div>
                  <div className="text-white">{new Date(content.startDate).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-400">End Date</div>
                  <div className="text-white">{new Date(content.endDate).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {content.description && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Description</h4>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{content.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Rules */}
      {content.rules && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Rules</h4>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{content.rules}</p>
          </CardContent>
        </Card>
      )}

      {/* Image */}
      {content.imageUrl && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Tournament Banner</h4>
            <img 
              src={content.imageUrl} 
              alt="Tournament Banner" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPostContent = () => (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
        {getActionIcon(content.action)}
        <div>
          <h3 className={`text-lg font-semibold ${getActionColor(content.action)}`}>
            {getActionText(content.action)} Post
          </h3>
          <p className="text-gray-400 text-sm">
            Submitted by {content.organizerName || 'Unknown'} on {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Details */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Post Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400">Title:</span>
              <span className="text-white ml-2 font-medium">{content.title}</span>
            </div>
            <div>
              <span className="text-gray-400">Content:</span>
              <div className="text-gray-300 mt-2 text-sm whitespace-pre-wrap" 
                   dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image */}
      {content.imageUrl && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Featured Image</h4>
            <img 
              src={content.imageUrl} 
              alt="Post Image" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#15151a] border-[#292932] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Review Pending {contentType === 'tournament' ? 'Tournament' : 'Post'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {contentType === 'tournament' ? renderTournamentContent() : renderPostContent()}

          <div className="flex justify-end space-x-3 pt-6 border-t border-[#292932]">
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-[#292932] hover:text-white hover:bg-[#292932]"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 