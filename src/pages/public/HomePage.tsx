import React from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UsersIcon, CalendarIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const HomePage: React.FC = () => {
  const featuredTournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      date: "Jan 15 - Jan 17, 2025",
      participants: 128,
      prize: "$10,000",
      status: "Registration Open",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      date: "Jan 20 - Jan 22, 2025",
      participants: 64,
      prize: "$15,000",
      status: "Coming Soon",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 3,
      title: "Mobile Legends Tournament",
      date: "Jan 25 - Jan 27, 2025",
      participants: 96,
      prize: "$8,000",
      status: "Registration Open",
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    }
  ];

  const leaderboard = [
    { rank: 1, player: "ProGamer123", points: 2450, avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { rank: 2, player: "EsportsKing", points: 2380, avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { rank: 3, player: "GameMaster", points: 2290, avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { rank: 4, player: "PixelWarrior", points: 2180, avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { rank: 5, player: "CyberNinja", points: 2050, avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
  ];

  const news = [
    {
      id: 1,
      title: "New Tournament Format Announced",
      excerpt: "We're introducing a revolutionary bracket system for better competitive balance...",
      date: "Jan 10, 2025",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Prize Pool Increased for Winter Championship",
      excerpt: "Due to overwhelming response, we've increased the total prize pool to $50,000...",
      date: "Jan 8, 2025",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1"
    }
  ];

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
            <Link to="/register">
              <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white px-8 py-3 text-lg">
                Join as Player
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button variant="outline" className=" px-8 py-3 text-lg">
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
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
                <div className="relative">
                  <img 
                    src={tournament.image} 
                    alt={tournament.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tournament.status === "Registration Open" 
                        ? "bg-green-600 text-white" 
                        : "bg-yellow-600 text-white"
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
                  <div className="space-y-2 text-gray-400 text-sm mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {tournament.date}
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {tournament.participants} participants
                    </div>
                    <div className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      {tournament.prize} prize pool
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
                    {leaderboard.map((player) => (
                      <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-[#19191d]">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            player.rank === 1 ? "bg-yellow-500 text-black" :
                            player.rank === 2 ? "bg-gray-400 text-black" :
                            player.rank === 3 ? "bg-orange-600 text-white" :
                            "bg-[#292932] text-white"
                          }`}>
                            {player.rank}
                          </div>
                          <img 
                            src={player.avatar} 
                            alt={player.player}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-white font-medium">{player.player}</span>
                        </div>
                        <span className="text-[#f34024] font-bold">{player.points} pts</span>
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
                  <Card key={article.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
                    <div className="flex">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-24 h-24 object-cover"
                      />
                      <CardContent className="p-4 flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{article.excerpt}</p>
                        <span className="text-[#f34024] text-xs">{article.date}</span>
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