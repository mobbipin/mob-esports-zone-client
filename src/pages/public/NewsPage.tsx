import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UserIcon, TagIcon, SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";

export const NewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ status: boolean; data: any[] }>(`/posts?search=${searchTerm}`)
      .then(res => setNews(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load news"))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const allTags = [
    "all",
    ...Array.from(new Set(news.flatMap(article => article.tags || [])))
  ];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || (article.tags && article.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const featuredArticle = filteredNews.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      {[...Array(6)].map((_, i) => <Skeleton key={i} height={100} className="mb-4" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Latest News</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and insights from the world of competitive esports.
          </p>
        </div>
        <div className="bg-[#15151a] rounded-lg p-6 mb-8 border border-[#292932]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-[#f34024] text-white"
                      : "bg-[#292932] text-gray-300 hover:bg-[#3a3a3e]"
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-white">Loading news...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            {featuredArticle && (
              <Card className="bg-[#15151a] border-[#292932] overflow-hidden mb-12 hover:border-[#f34024] transition-colors">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredArticle.thumbnail	 || featuredArticle.image || ""} 
                      alt={featuredArticle.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#f34024] text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                      {(featuredArticle.tags || []).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-[#292932] text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span className="mr-4">{featuredArticle.author || "Admin"}</span>
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span className="mr-4">{featuredArticle.createdAt ? new Date(featuredArticle.createdAt).toLocaleDateString() : "TBA"}</span>
                        <span>{featuredArticle.readTime || ""}</span>
                      </div>
                      <Link to={`/news/${featuredArticle.id}`}>
                        <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Card key={article.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={article.thumbnail	 || article.image || ""} 
                      alt={article.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-bold text-white mb-2">{article.title}</h2>
                    <p className="text-gray-400 mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span><UserIcon className="w-4 h-4 inline mr-1" /> {article.author || "Admin"}</span>
                      <span><CalendarIcon className="w-4 h-4 inline mr-1" /> {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "TBA"}</span>
                    </div>
                    <Link to={`/news/${article.id}`} className="block mt-4">
                      <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">Read More</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};