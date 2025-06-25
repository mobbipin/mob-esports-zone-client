import React from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, MapPinIcon, ClockIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Mock tournament data - in real app, fetch based on ID
  const tournament = {
    id: 1,
    title: "PUBG Mobile Championship",
    description: "The ultimate battle royale tournament featuring the best players from around the world. This championship will test your skills, strategy, and teamwork in intense matches across multiple maps. Only the strongest will survive to claim the crown.",
    longDescription: "Join us for the most competitive PUBG Mobile tournament of the year. This championship features a unique format with group stages, knockout rounds, and a grand finale that will determine the ultimate champion. Players will compete across classic maps including Erangel, Miramar, and Sanhok, with special tournament rules to ensure fair play and maximum excitement.",
    date: "Jan 15 - Jan 17, 2025",
    startTime: "10:00 AM EST",
    participants: 128,
    maxParticipants: 128,
    prize: "$10,000",
    status: "Registration Open",
    type: "Squad",
    game: "PUBG Mobile",
    format: "Battle Royale",
    platform: "Mobile",
    region: "Global",
    organizer: "MOB Esports Zone",
    image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
    rules: [
      "Teams must consist of 4 players",
      "All matches will be played on official tournament servers",
      "Use of cheats or exploits will result in immediate disqualification",
      "Players must be present 15 minutes before match time",
      "Tournament officials' decisions are final"
    ],
    prizeDistribution: [
      { position: "1st Place", prize: "$5,000", percentage: 50 },
      { position: "2nd Place", prize: "$2,500", percentage: 25 },
      { position: "3rd Place", prize: "$1,500", percentage: 15 },
      { position: "4th-8th Place", prize: "$250 each", percentage: 10 }
    ],
    schedule: [
      { date: "Jan 15", time: "10:00 AM", event: "Group Stage - Round 1" },
      { date: "Jan 15", time: "2:00 PM", event: "Group Stage - Round 2" },
      { date: "Jan 16", time: "10:00 AM", event: "Knockout Stage - Quarterfinals" },
      { date: "Jan 16", time: "2:00 PM", event: "Knockout Stage - Semifinals" },
      { date: "Jan 17", time: "12:00 PM", event: "Grand Finals" }
    ]
  };

  const registeredTeams = [
    { id: 1, name: "Team Alpha", members: 4, captain: "ProGamer123", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 2, name: "Elite Squad", members: 4, captain: "EsportsKing", avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 3, name: "Victory Legends", members: 4, captain: "GameMaster", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 4, name: "Phoenix Rising", members: 4, captain: "PixelWarrior", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 5, name: "Storm Breakers", members: 4, captain: "CyberNinja", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 6, name: "Apex Hunters", members: 4, captain: "ShadowStrike", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-600";
      case "Coming Soon":
        return "bg-yellow-600";
      case "Ongoing":
        return "bg-blue-600";
      case "Full":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/tournaments" className="inline-flex items-center text-[#f34024] hover:text-[#f34024]/80 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Tournaments
        </Link>

        {/* Tournament Header */}
        <div className="relative mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <img 
              src={tournament.image} 
              alt={tournament.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#19191d]/80 text-white text-sm font-semibold rounded">
                  {tournament.game}
                </span>
                <span className="px-3 py-1 bg-[#f34024] text-white text-sm font-semibold rounded">
                  {tournament.type}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tournament.title}</h1>
              <p className="text-lg text-gray-200">{tournament.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tournament Info */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <CalendarIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-sm text-gray-400">{tournament.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <ClockIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Start Time</div>
                        <div className="text-sm text-gray-400">{tournament.startTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <UsersIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Participants</div>
                        <div className="text-sm text-gray-400">{tournament.participants}/{tournament.maxParticipants}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <TrophyIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Prize Pool</div>
                        <div className="text-sm text-gray-400">{tournament.prize}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPinIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Region</div>
                        <div className="text-sm text-gray-400">{tournament.region}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <div className="w-5 h-5 mr-3 bg-[#f34024] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <div>
                        <div className="font-medium">Platform</div>
                        <div className="text-sm text-gray-400">{tournament.platform}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[#292932] pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">About This Tournament</h3>
                  <p className="text-gray-300 leading-relaxed">{tournament.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Rules</h2>
                <ul className="space-y-3">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <span className="w-6 h-6 bg-[#f34024] text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Schedule</h2>
                <div className="space-y-4">
                  {tournament.schedule.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-[#19191d] rounded-lg">
                      <div className="text-center mr-4">
                        <div className="text-[#f34024] font-bold text-sm">{item.date}</div>
                        <div className="text-gray-400 text-xs">{item.time}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Registration */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registration</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Spots Filled</span>
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-[#292932] rounded-full h-2">
                    <div 
                      className="bg-[#f34024] h-2 rounded-full"
                      style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                      Register Team
                    </Button>
                    <Button variant="outline" className="w-full border-[#292932 hover:bg-[#292932] hover:text-white">
                      Join Discord
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login">
                      <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                        Login to Register
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-400 text-center">
                      You need to be logged in to register for tournaments
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prize Distribution */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Prize Distribution</h3>
                <div className="space-y-3">
                  {tournament.prizeDistribution.map((prize, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-[#19191d] rounded-lg">
                      <span className="text-gray-300 font-medium">{prize.position}</span>
                      <span className="text-[#f34024] font-bold">{prize.prize}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Registered Teams */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registered Teams</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {registeredTeams.map((team) => (
                    <div key={team.id} className="flex items-center p-3 bg-[#19191d] rounded-lg">
                      <img 
                        src={team.avatar} 
                        alt={team.captain}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{team.name}</div>
                        <div className="text-gray-400 text-xs">Captain: {team.captain}</div>
                      </div>
                      <div className="text-[#f34024] text-xs font-medium">
                        {team.members}/4
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-[#292932]  hover:bg-[#292932] text-sm">
                    View All Teams
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};