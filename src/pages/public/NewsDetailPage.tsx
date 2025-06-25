import React from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UserIcon, ClockIcon, ArrowLeftIcon, ShareIcon, TagIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams();

  // Mock article data - in real app, fetch based on ID
  const article = {
    id: 1,
    title: "New Tournament Format Announced for 2025 Season",
    content: `
      <p>We're excited to announce a revolutionary new tournament format that will transform the competitive esports landscape for the 2025 season. After months of planning and community feedback, we've developed a system that ensures better balance, more exciting matches, and fairer competition for all participants.</p>

      <h2>What's New in the Format</h2>
      <p>The new tournament structure introduces several key innovations:</p>
      
      <h3>Group Stage Evolution</h3>
      <p>Our enhanced group stage system now features dynamic seeding based on recent performance metrics. Teams will be placed into groups that ensure competitive balance while maintaining the excitement of unpredictable matchups. Each group will consist of 8 teams, with the top 4 advancing to the knockout stages.</p>

      <h3>Double Elimination Brackets</h3>
      <p>We're implementing a double elimination system for the knockout rounds, giving teams a second chance to prove themselves. This format has been proven to produce more accurate results and provides additional opportunities for comeback stories that fans love.</p>

      <h3>Wildcard Rounds</h3>
      <p>New wildcard rounds will give exceptional performers from the group stages additional opportunities to advance. These special matches will be determined by community voting and performance analytics, adding an extra layer of excitement to the tournament progression.</p>

      <h2>Community Impact</h2>
      <p>This new format was developed with extensive input from our community. Over 10,000 players and fans participated in our feedback surveys, and their insights have been instrumental in shaping these changes. The format addresses the most common concerns about fairness and excitement in competitive play.</p>

      <h3>Enhanced Viewing Experience</h3>
      <p>For spectators, the new format means more meaningful matches throughout the tournament. Every game will have significant implications, and the extended format allows for better storytelling and more opportunities for underdog victories.</p>

      <h2>Implementation Timeline</h2>
      <p>The new format will be gradually rolled out starting with our February tournaments. We'll begin with smaller events to test and refine the system before implementing it in our major championships. Player feedback during this transition period will be crucial for final adjustments.</p>

      <h3>Training and Preparation</h3>
      <p>To help teams prepare for the new format, we're providing comprehensive guides and hosting practice tournaments. These resources will ensure that all participants can adapt to the changes and compete at their highest level.</p>

      <h2>Looking Forward</h2>
      <p>This format represents our commitment to evolving with the esports community and providing the best possible competitive experience. We believe these changes will elevate the quality of competition and create more memorable moments for players and fans alike.</p>

      <p>Stay tuned for more detailed information about specific tournament implementations and registration details for upcoming events under the new format.</p>
    `,
    author: "Admin Team",
    authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
    date: "Jan 10, 2025",
    readTime: "8 min read",
    tags: ["Tournament", "Announcement", "Format", "2025"],
    image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
    views: 1247,
    likes: 89
  };

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
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.tags.map((tag) => (
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
                  src={article.authorAvatar} 
                  alt={article.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">{article.author}</div>
                  <div className="text-gray-400 text-sm">Author</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {article.date}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <ClockIcon className="w-4 h-4 mr-2" />
                {article.readTime}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{article.views} views</span>
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
                __html: article.content.replace(
                  /<h2>/g, '<h2 style="color: white; font-size: 1.5rem; font-weight: bold; margin: 2rem 0 1rem 0;">'
                ).replace(
                  /<h3>/g, '<h3 style="color: #f34024; font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 0.75rem 0;">'
                ).replace(
                  /<p>/g, '<p style="margin-bottom: 1.5rem; color: #d1d5db;">'
                )
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