import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UsersIcon, CalendarIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { TournamentCardSkeleton, DashboardSkeleton } from "../../components/ui/skeleton";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [featuredTournaments, setFeaturedTournaments] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch<any>(`/tournaments?limit=3`),
      apiFetch<any>(`/players?limit=5`),
      apiFetch<any>(`/posts?limit=2`)
    ])
      .then(([tournamentsRes, playersRes, postsRes]) => {
        setFeaturedTournaments(tournamentsRes.data || []);
        setLeaderboard(playersRes.data || []);
        setNews(postsRes.data || []);
      })
      .catch((err) => {
        setError("Failed to load homepage data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-r from-[#1a1a1e] via-[#2a2a2e] to-[#1a1a1e] py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-8"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-gray-700 rounded w-48 mx-auto sm:mx-0"></div>
              <div className="h-12 bg-gray-700 rounded w-48 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournaments Skeleton */}
      <section className="py-16 bg-[#19191d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="h-6 bg-gray-700 rounded w-24"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & News Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="h-8 bg-gray-700 rounded w-48 mb-8"></div>
              <div className="bg-[#15151a] border-[#292932] rounded-xl p-6 animate-pulse">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#19191d]">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 bg-gray-700 rounded w-32"></div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-[#15151a] border-[#292932] rounded-xl overflow-hidden animate-pulse">
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-700"></div>
                      <div className="p-4 flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a1a1e] via-[#2a2a2e] to-[#1a1a1e] py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            MOB ESPORTS
            <span className="block text-[#f34024]">ZONE</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the ultimate competitive gaming platform. Compete in tournaments, 
            build your team, and rise through the ranks to become a champion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'tournament_organizer' ? '/organizer' : '/dashboard'}>
                <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white px-8 py-3 text-lg" size="lg">
                  Go to My Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white px-8 py-3 text-lg" size="lg">
                  Join as Player
                </Button>
              </Link>
            )}
            <Link to="/tournaments">
              <Button variant="outline" className="px-8 py-3 text-lg" size="lg">
                View Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-[#19191d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Tournaments</h2>
            <Link to="/tournaments" className="flex items-center text-[#f34024] hover:text-[#f34024]/80 transition-colors">
              View All <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:shadow-lg hover:shadow-[#f34024]/10 transform hover:-translate-y-1" interactive hover>
                <div className="relative">
                  <img 
                    src={tournament.imageUrl || tournament.bannerUrl || "https://via.placeholder.com/400x200?text=Tournament"} 
                    alt={tournament.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tournament.status === "registration" 
                        ? "bg-green-600 text-white" 
                        : tournament.status === "upcoming"
                          ? "bg-yellow-600 text-white"
                          : tournament.status === "ongoing"
                            ? "bg-blue-600 text-white"
                            : tournament.status === "completed"
                              ? "bg-gray-600 text-white"
                              : "bg-[#292932] text-white"
                    }`}>
                      {tournament.status ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1) : "Unknown"}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
                  <div className="space-y-2 text-gray-400 text-sm mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {tournament.startDate ? `${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}` : "TBA"}
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {tournament.maxTeams || tournament.maxParticipants || 0} participants
                    </div>
                    <div className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      {tournament.prizePool ? `$${tournament.prizePool.toLocaleString()}` : "TBA"} prize pool
                    </div>
                  </div>
                  <Link to={`/tournaments/${tournament.id}`}>
                    <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Leaderboard */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Top Players</h2>
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((player, idx) => (
                      <div key={player.id || idx} className="flex items-center justify-between p-3 rounded-lg bg-[#19191d] hover:bg-[#292932] transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            idx === 0 ? "bg-yellow-500 text-black" :
                            idx === 1 ? "bg-gray-400 text-black" :
                            idx === 2 ? "bg-orange-600 text-white" :
                            "bg-[#292932] text-white"
                          }`}>
                            {idx + 1}
                          </div>
                          <img 
                            src={player.playerProfile?.avatar || "https://via.placeholder.com/40x40?text=P"} 
                            alt={player.displayName || player.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-white font-medium">{player.displayName || player.username}</span>
                        </div>
                        <span className="text-[#f34024] font-bold">{player.playerProfile?.rank || "-"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Latest News</h2>
                <Link to="/news" className="flex items-center text-[#f34024] hover:text-[#f34024]/80 transition-colors">
                  View All <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-6">
                {news.map((article) => (
                  <Card key={article.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:shadow-lg hover:shadow-[#f34024]/10 transform hover:-translate-y-1" interactive hover>
                    <div className="flex">
                      <img 
                        src={article.thumbnail || "https://via.placeholder.com/96x96?text=News"} 
                        alt={article.title}
                        className="w-24 h-24 object-cover"
                      />
                      <CardContent className="p-4 flex-1">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{article.content}</p>
                        <div className="text-gray-500 text-xs mt-2">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#f34024] to-[#ff6b47]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Compete?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of players in the most competitive esports tournaments. 
            Build your team, climb the ranks, and win amazing prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-[#f34024] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                JOIN OUR LEAGUE NOW
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button variant="outline" className=" hover:text-[#f34024] px-8 py-3 text-lg">
                Browse Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};