import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, FileTextIcon, CalendarIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { PostDialog } from "../../components/ui/PostDialog";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

// Add DeleteDialog component
const DeleteDialog = ({ open, onConfirm, onCancel, message, loading }: { open: boolean, onConfirm: () => void, onCancel: () => void, message: string, loading?: boolean }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#19191d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#292932]">
        <div className="text-lg text-white font-semibold mb-4">Confirm Deletion</div>
        <div className="text-gray-300 mb-6">{message}</div>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" className="border-[#292932]">Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white" disabled={loading}>{loading ? "Deleting..." : "Delete"}</Button>
        </div>
      </div>
    </div>
  );
};

export const OrganizerPostsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, postId?: string, postTitle?: string, source?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<any>('/pending/organizer/posts');
        setPosts(response.data || []);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleCreatePost = async (data: any) => {
    try {
      await apiFetch('/pending/posts', {
        method: 'POST',
        body: JSON.stringify(data)
      }, true, false, false);
      toast.success('Post created successfully!');
      setShowDialog(false);
      // Refresh the list
      const response = await apiFetch<any>('/pending/organizer/posts');
      setPosts(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const handleEditPost = async (data: any) => {
    if (!editingPost) return;
    
    try {
      // If post is approved, use pending system
      if (editingPost.source === 'approved') {
        await apiFetch(`/pending/posts`, {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            originalId: editingPost.id,
            action: 'update'
          })
        }, true, false, false);
        toast.success('Post update submitted for approval!');
      } else {
        // For pending posts, update directly
        await apiFetch(`/pending/posts/${editingPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        }, true, false, false);
        toast.success('Post updated successfully!');
      }
      setShowDialog(false);
      setEditingPost(null);
      setIsEditing(false);
      // Refresh the list
      const response = await apiFetch<any>('/pending/organizer/posts');
      setPosts(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
    }
  };

  const handleDeletePost = async (postId: string, source: string) => {
    setDeleteDialog({ open: true, postId, postTitle: posts.find(p => p.id === postId)?.title, source });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.postId) return;
    
    setDeleting(true);
    try {
      if (deleteDialog.source === 'pending') {
        await apiFetch(`/pending/posts/${deleteDialog.postId}`, { method: "DELETE" }, true, false, false);
        toast.success("Post deleted successfully");
      } else if (deleteDialog.source === 'approved') {
        // For approved posts, submit deletion request through pending system
        await apiFetch(`/pending/posts`, {
          method: 'POST',
          body: JSON.stringify({
            originalId: deleteDialog.postId,
            action: 'delete'
          })
        }, true, false, false);
        toast.success("Post deletion submitted for approval");
      } else {
        await apiFetch(`/posts/${deleteDialog.postId}`, { method: "DELETE" }, true, false, false);
        toast.success("Post deleted successfully");
      }
      setPosts(prev => prev.filter(post => post.id !== deleteDialog.postId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeleteDialog({ open: false });
      setDeleting(false);
    }
  };

  const openEditDialog = (post: any) => {
    setEditingPost(post);
    setIsEditing(true);
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setIsEditing(false);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingPost(null);
    setIsEditing(false);
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
        <div className="text-red-500 text-xl mb-4">Error Loading Posts</div>
        <div className="text-gray-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate("/organizer")}
              variant="outline"
              className="border-[#292932] hover:text-white hover:bg-[#292932]"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Posts</h1>
              <p className="text-gray-400">Manage your posts and articles</p>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">{posts.filter(p => p.source === 'approved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">{posts.filter(p => p.source === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-12 text-center">
              <FileTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
              <p className="text-gray-400 mb-6">Create your first post to get started</p>
              <Button 
                onClick={openCreateDialog}
                className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-[#15151a] border-[#292932] hover:border-[#f34024]/50 transition-colors">
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
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.source === 'approved' ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                        }`}>
                          {post.source === 'approved' ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Likes: {post.likes || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#292932]">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] text-white"
                          onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] text-white"
                          onClick={() => openEditDialog(post)}
                        >
                          <EditIcon className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeletePost(post.id, post.source)}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Post Dialog */}
        <PostDialog
          open={showDialog}
          onClose={closeDialog}
          onSubmit={isEditing ? handleEditPost : handleCreatePost}
          post={editingPost}
          isEditing={isEditing}
        />

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialog.open}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ ...deleteDialog, open: false })}
          message={`Are you sure you want to delete "${deleteDialog.postTitle}"? This action cannot be undone.`}
          loading={deleting}
        />
      </div>
    </div>
  );
}; 