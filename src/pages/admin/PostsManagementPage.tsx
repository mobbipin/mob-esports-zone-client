import React, { useState } from "react";
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";

export const PostsManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      title: "New Tournament Format Announced for 2025 Season",
      excerpt: "We're introducing a revolutionary bracket system that will change how competitive esports tournaments are played...",
      author: "Admin Team",
      status: "published",
      publishDate: "Jan 10, 2025",
      views: 1247,
      likes: 89,
      tags: ["Tournament", "Announcement"],
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Prize Pool Increased for Winter Championship",
      excerpt: "Due to overwhelming response from the community, we've decided to increase the total prize pool for our Winter Championship...",
      author: "Tournament Director",
      status: "published",
      publishDate: "Jan 8, 2025",
      views: 892,
      likes: 67,
      tags: ["Prize", "Championship"],
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 3,
      title: "Mobile Gaming Takes Center Stage",
      excerpt: "Mobile esports continues to grow with new tournaments and increased participation. Here's what you need to know...",
      author: "Gaming Analyst",
      status: "draft",
      publishDate: "Jan 5, 2025",
      views: 0,
      likes: 0,
      tags: ["Mobile", "Gaming", "Trends"],
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 4,
      title: "Player Spotlight: Rising Stars of 2025",
      excerpt: "Meet the upcoming players who are making waves in the competitive scene. These rising stars are ones to watch...",
      author: "Community Manager",
      status: "scheduled",
      publishDate: "Jan 15, 2025",
      views: 0,
      likes: 0,
      tags: ["Players", "Spotlight"],
      image: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 5,
      title: "New Anti-Cheat System Implementation",
      excerpt: "We're rolling out an advanced anti-cheat system to ensure fair play across all tournaments...",
      author: "Technical Team",
      status: "published",
      publishDate: "Dec 28, 2024",
      views: 1456,
      likes: 123,
      tags: ["Security", "Fair Play"],
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    }
  ];

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "draft"
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

  const handleDeletePost = (postId: number, postTitle: string) => {
    if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      addToast(`Post "${postTitle}" has been deleted`, "success");
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Post created successfully!", "success");
    setShowCreateModal(false);
    setFormData({ title: "", content: "", tags: "", status: "draft" });
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Posts Management</h1>
          <p className="text-gray-400">Create and manage news articles and announcements</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
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
                <Button size="sm" variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
            <div className="relative">
              <img 
                src={post.image} 
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(post.status)}`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((tag) => (
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
                  className="flex-1 border-[#292932] text-white hover:bg-[#292932]"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#292932] text-white hover:bg-[#292932]"
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

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No posts found</div>
          <p className="text-gray-500 mb-6">Try adjusting your search terms or create a new post</p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#15151a] border-[#292932] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Create New Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content *</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    placeholder="Write your post content..."
                    className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tags</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publish Now</option>
                    <option value="scheduled">Schedule for Later</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    Create Post
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 border-[#292932] text-white hover:bg-[#292932]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
            Previous
          </Button>
          <Button variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};