import React, { useEffect, useState } from "react";
import { EyeIcon, CheckIcon, XIcon, FileTextIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { PendingContentDialog } from "../../components/ui/PendingContentDialog";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

export const AdminPendingPostsPage: React.FC = () => {
  const { user } = useAuth();
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<any>('/pending/posts');
        setPendingPosts(response.data || []);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load pending posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, [user]);

  const handleReview = async (postId: string, approved: boolean, reviewNotes?: string) => {
    try {
      await apiFetch(`/pending/posts/${postId}/review`, {
        method: "PUT",
        body: JSON.stringify({
          approved,
          reviewNotes: reviewNotes || ""
        })
      });
      
      // Remove from list
      setPendingPosts(prev => prev.filter(p => p.id !== postId));
      
      toast.success(approved ? "Post approved and published" : "Post rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to review post");
    }
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={200} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error Loading Pending Posts</div>
        <div className="text-gray-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pending Posts</h1>
          <p className="text-gray-400">Review and approve/reject post submissions from organizers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{pendingPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingPosts.filter(p => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(p.createdAt) > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Organizers</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(pendingPosts.map(p => p.createdBy)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Posts */}
        {pendingPosts.length === 0 ? (
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-12 text-center">
              <FileTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Pending Posts</h3>
              <p className="text-gray-400">All post submissions have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPosts.map((post) => (
              <Card key={post.id} className="bg-[#15151a] border-[#292932] hover:border-yellow-500/50 transition-colors">
                <CardContent className="p-6">
                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {post.content}
                    </p>
                    
                    {/* Post Meta */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-600 text-white">
                          Pending Review
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Submitted by: {post.organizerName || post.organizerEmail}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#292932]">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] hover:text-white"
                          onClick={() => handleViewPost(post)}
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleReview(post.id, true)}
                        >
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleReview(post.id, false)}
                        >
                          <XIcon className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pending Content Dialog */}
        <PendingContentDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          content={selectedPost}
          contentType="post"
        />
      </div>
    </div>
  );
}; 