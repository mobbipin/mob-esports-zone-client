import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UserIcon, TagIcon, SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const NewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const news = [
    {
      id: 1,
      title: "New Tournament Format Announced for 2025 Season",
      excerpt: "We're introducing a revolutionary bracket system that will change how competitive esports tournaments are played. This new format ensures better balance and more exciting matches.",
      content: "The new tournament format includes group stages, double elimination brackets, and special wildcard rounds...",
      author: "Admin Team",
      date: "Jan 10, 2025",
      readTime: "3 min read",
      tags: ["Tournament", "Announcement"],
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: true
    },
    {
      id: 2,
      title: "Prize Pool Increased for Winter Championship",
      excerpt: "Due to overwhelming response from the community, we've decided to increase the total prize pool for our Winter Championship to $50,000.",
      content: "The increased prize pool will be distributed across all tournaments in the winter season...",
      author: "Tournament Director",
      date: "Jan 8, 2025",
      readTime: "2 min read",
      tags: ["Prize", "Championship"],
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: false
    },
    {
      id: 3,
      title: "Mobile Gaming Takes Center Stage",
      excerpt: "Mobile esports continues to grow with new tournaments and increased participation. Here's what you need to know about the mobile gaming revolution.",
      content: "Mobile gaming has become the fastest growing segment in esports...",
      author: "Gaming Analyst",
      date: "Jan 5, 2025",
      readTime: "5 min read",
      tags: ["Mobile", "Gaming", "Trends"],
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: false
    },
    {
      id: 4,
      title: "Player Spotlight: Rising Stars of 2025",
      excerpt: "Meet the upcoming players who are making waves in the competitive scene. These rising stars are ones to watch this season.",
      content: "This month we're highlighting some of the most promising new talent...",
      author: "Community Manager",
      date: "Jan 3, 2025",
      readTime: "4 min read",
      tags: ["Players", "Spotlight"],
      image: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: false
    },
    {
      id: 5,
      title: "New Anti-Cheat System Implementation",
      excerpt: "We're rolling out an advanced anti-cheat system to ensure fair play across all tournaments. Here's what players need to know.",
      content: "Fair play is essential to competitive gaming...",
      author: "Technical Team",
      date: "Dec 28, 2024",
      readTime: "3 min read",
      tags: ["Security", "Fair Play"],
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: false
    },
    {
      id: 6,
      title: "Community Tournament Success Stories",
      excerpt: "Celebrating the amazing community-organized tournaments that have brought players together and created unforgettable moments.",
      content: "Our community continues to amaze us with their creativity and passion...",
      author: "Community Team",
      date: "Dec 25, 2024",
      readTime: "6 min read",
      tags: ["Community", "Success"],
      image: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=1",
      featured: false
    }
  ];

  const allTags = ["all", ...Array.from(new Set(news.flatMap(article => article.tags)))];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || article.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const featuredArticle = filteredNews.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Latest News</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and insights from the world of competitive esports.
          </p>
        </div>

        {/* Search and Filters */}
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

        {/* Featured Article */}
        {featuredArticle && (
          <Card className="bg-[#15151a] border-[#292932] overflow-hidden mb-12 hover:border-[#f34024] transition-colors">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#f34024] text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                  {featuredArticle.tags.map((tag) => (
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
                    <span className="mr-4">{featuredArticle.author}</span>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="mr-4">{featuredArticle.date}</span>
                    <span>{featuredArticle.readTime}</span>
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

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
            <Card key={article.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:transform hover:scale-105">
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-[#19191d]/80 text-white text-xs font-medium rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <span>{article.readTime}</span>
                </div>
                
                <Link to={`/news/${article.id}`}>
                  <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    Read Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No articles found</div>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-[#292932]  hover:bg-[#292932] hover:text-white px-8">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};