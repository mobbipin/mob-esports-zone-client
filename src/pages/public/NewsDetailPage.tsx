import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UserIcon, ClockIcon, ArrowLeftIcon, ShareIcon, TagIcon, HeartIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/posts/${id}`)
      .then(res => {
        setArticle(res.data);
        setLikeCount(res.data.likes || 0);
        // Check if user has liked this article
        setLiked(Boolean(res.data.userLiked));
      })
      .catch(err => setError(typeof err === "string" ? err : "Failed to load article"))
      .finally(() => setLoading(false));
  }, [id, user?.id]); // Only depend on user.id, not the entire user object

      const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like articles");
      return;
    }
    
    if (likeLoading) return; // Prevent rapid clicking
    
    setLikeLoading(true);
    
    // Get current state before any changes
    const currentLiked = liked;
    const currentLikeCount = likeCount;
    
    try {
      if (currentLiked) {
        // Currently liked, so unlike
        await apiFetch(`/posts/unlike`, { 
          method: "POST", 
          body: JSON.stringify({ postId: id })
        }, true, false, false);
        setLiked(false);
        setLikeCount(currentLikeCount - 1);
      } else {
        // Currently not liked, so like
        await apiFetch(`/posts/like`, { 
          method: "POST", 
          body: JSON.stringify({ postId: id })
        }, true, false, false);
        setLiked(true);
        setLikeCount(currentLikeCount + 1);
      }
    } catch (error: any) {
      if (error.message && error.message.includes("already liked")) {
        setLiked(true);
        await refreshLikeState();
        return;
      }
      if (error.message && error.message.includes("not liked")) {
        setLiked(false);
        await refreshLikeState();
        return;
      }
      
      toast.error("Failed to update like status");
    } finally {
      setLikeLoading(false);
    }
  };

  const refreshLikeState = async () => {
    if (!id || !user) return;
    
    try {
      const res = await apiFetch<{ status: boolean; data: any }>(`/posts/${id}`);
      setLikeCount(res.data.likes || 0);
      setLiked(Boolean(res.data.userLiked));
    } catch (error) {
      // Silently fail, don't show error for refresh
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || "Check out this article";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/news" className="inline-flex items-center text-[#f34024] hover:text-[#f34024]/80 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to News
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
            <img 
              src={article.imageUrl || article.image || ""} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(article.tags || []).map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-[#f34024] text-white text-sm font-medium rounded-full">
                <TagIcon className="w-3 h-3 inline mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#292932]">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <img 
                  src={article.authorAvatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"} 
                  alt={article.author || "Admin"}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">{article.author || "Admin"}</div>
                  <div className="text-gray-400 text-sm">Author</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "TBA"}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <ClockIcon className="w-4 h-4 mr-2" />
                {article.readTime || ""}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-[#292932] hover:text-white hover:bg-[#292932]"
                onClick={handleShare}
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="bg-[#15151a] border-[#292932] mb-12">
          <CardContent className="p-8">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              style={{
                color: '#e5e7eb',
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ 
                __html: article.content || ""
              }}
            />
          </CardContent>
        </Card>

        {/* Article Actions */}
        <div className="flex items-center justify-between mb-12 p-6 bg-[#15151a] rounded-lg border border-[#292932]">
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={handleLike}
                disabled={likeLoading}
                className={`${
                  liked 
                    ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                    : 'bg-[#f34024] hover:bg-[#f34024]/90 border-[#f34024]'
                } text-white border-2 transition-all duration-200 ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <HeartIcon className={`w-4 h-4 mr-2 ${liked ? 'fill-white' : ''} ${likeLoading ? 'animate-pulse' : ''}`} />
                {likeLoading ? '...' : `${liked ? 'Liked' : 'Like'} (${likeCount})`}
              </Button>
            ) : (
              <Button 
                onClick={() => toast.error("Please login to like articles")}
                className="bg-[#f34024] hover:bg-[#f34024]/90 text-white border-2 border-[#f34024]"
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Like ({likeCount})
              </Button>
            )}
            <Button 
              variant="outline" 
              className="border-[#292932] hover:text-white hover:bg-[#292932]"
              onClick={handleShare}
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
          
          <div className="text-gray-400 text-sm">
            Found this helpful? Share it with your team!
          </div>
        </div>
      </div>
    </div>
  );
};