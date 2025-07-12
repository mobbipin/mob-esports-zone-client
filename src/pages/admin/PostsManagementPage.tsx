import React, { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { PostDialog } from "../../components/ui/PostDialog";
import { apiFetch, apiUpload } from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";

// Add a simple DeleteDialog component at the top of the file
const DeleteDialog = ({ open, onConfirm, onCancel, message }: { open: boolean, onConfirm: () => void, onCancel: () => void, message: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#19191d] p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-white mb-4">{message}</div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel} variant="outline" className="border-[#292932]">Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export const PostsManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, postId?: string, postTitle?: string }>({ open: false });

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = `/posts?admin=true&page=${page}&limit=${limit}`;
      if (statusFilter !== "all") query += `&status=${statusFilter}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await apiFetch<any>(query);
      setPosts(Array.isArray(res.data) ? res.data : []);
      setTotal(res.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load posts");
      console.error("Posts API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [page, statusFilter, searchTerm]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "draft",
    imageUrl: ""
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const handleDeletePost = (postId: string, postTitle: string) => {
    setDeleteDialog({ open: true, postId, postTitle });
  };
  const confirmDeletePost = async () => {
    if (!deleteDialog.postId || !deleteDialog.postTitle) return;
    try {
      await apiFetch(`/posts/${deleteDialog.postId}`, { method: "DELETE" });
      toast.success(`Post "${deleteDialog.postTitle}" has been deleted`);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to delete post");
    } finally {
      setDeleteDialog({ open: false });
    }
  };

  const handleCreatePost = async (data: any) => {
    try {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify(data)
      });
      toast.success("Post created successfully!");
      setShowCreateDialog(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to create post");
    }
  };

  const handleEditPost = async (data: any) => {
    if (!editingPost) return;
    
    try {
      await apiFetch(`/posts/${editingPost.id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      toast.success("Post updated successfully!");
      setShowCreateDialog(false);
      setEditingPost(null);
      setIsEditing(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to update post");
    }
  };

  const openEditDialog = (post: any) => {
    setEditingPost(post);
    setIsEditing(true);
    setShowCreateDialog(true);
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setIsEditing(false);
    setShowCreateDialog(true);
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingPost(null);
    setIsEditing(false);
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-600";
      case "draft":
        return "bg-gray-600";
      case "scheduled":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  const stats = [
    { label: "Total Posts", value: posts.length, color: "text-white" },
    { label: "Published", value: posts.filter(p => p.status === "published").length, color: "text-green-500" },
    { label: "Drafts", value: posts.filter(p => p.status === "draft").length, color: "text-gray-400" },
    { label: "Total Views", value: posts.reduce((sum, p) => sum + p.views, 0).toLocaleString(), color: "text-[#f34024]" }
  ];



  if (loading && !error) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <Skeleton key={i} height={220} className="mb-4" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Posts Management</h1>
          <p className="text-gray-400">Create and manage news articles and announcements</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Posts</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
                  Publish Selected
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
              <div className="relative">
                <img 
                  src={post.imageUrl || post.image} 
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="rounded border-[#292932] bg-[#19191d] text-[#f34024] focus:ring-[#f34024]"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(post.status || "draft")}`}>
                    {(post.status || "draft").charAt(0).toUpperCase() + (post.status || "draft").slice(1)}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(post.tags || []).map((tag: any) => (
                    <span key={tag} className="px-2 py-1 bg-[#292932] text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Author and Date */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>{post.publishDate}</span>
                  </div>
                </div>
                
                {/* Stats */}
                {post.status === "published" && (
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>{post.views} views</span>
                    <span>{post.likes} likes</span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
                    onClick={() => navigate(`/admin/posts/${post.id}/view`)}
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
                    onClick={() => openEditDialog(post)}
                  >
                    <EditIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleDeletePost(post.id, post.title)}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No posts found</div>
          <p className="text-gray-500 mb-6">Try adjusting your search terms or create a new post</p>
          <Button 
            onClick={openCreateDialog}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      )}

      {/* Post Dialog */}
      <PostDialog
        open={showCreateDialog}
        onClose={closeDialog}
        onSubmit={isEditing ? handleEditPost : handleCreatePost}
        post={editingPost}
        isEditing={isEditing}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Previous
          </Button>
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Next
          </Button>
        </div>
      </div>
      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onConfirm={confirmDeletePost}
        onCancel={() => setDeleteDialog({ open: false })}
        message={`Are you sure you want to delete post "${deleteDialog.postTitle}"? This action cannot be undone.`}
      />
    </div>
  );
};