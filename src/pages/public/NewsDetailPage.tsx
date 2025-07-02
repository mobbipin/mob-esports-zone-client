import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UserIcon, ClockIcon, ArrowLeftIcon, ShareIcon, TagIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/posts/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load article"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading article...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!article) return null;

  const relatedArticles = [
    {
      id: 2,
      title: "Prize Pool Increased for Winter Championship",
      excerpt: "Due to overwhelming response from the community, we've decided to increase the total prize pool...",
      date: "Jan 8, 2025",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 3,
      title: "Mobile Gaming Takes Center Stage",
      excerpt: "Mobile esports continues to grow with new tournaments and increased participation...",
      date: "Jan 5, 2025",
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 4,
      title: "Player Spotlight: Rising Stars of 2025",
      excerpt: "Meet the upcoming players who are making waves in the competitive scene...",
      date: "Jan 3, 2025",
      image: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    }
  ];

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
              src={article.imageUrl || article.image || "https://via.placeholder.com/800x400"} 
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
              <Button variant="outline" size="sm" className="border-[#292932] text-white hover:bg-[#292932]">
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
            <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
              👍 Like ({article.likes})
            </Button>
            <Button variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
              <ShareIcon className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
          
          <div className="text-gray-400 text-sm">
            Found this helpful? Share it with your team!
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
                <div className="relative">
                  <img 
                    src={relatedArticle.image} 
                    alt={relatedArticle.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{relatedArticle.date}</span>
                    <Link to={`/news/${relatedArticle.id}`}>
                      <Button size="sm" className="bg-[#f34024] hover:bg-[#f34024]/90 text-white text-xs">
                        Read
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};