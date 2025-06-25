import React, { useState } from "react";
import { PlusIcon, UserPlusIcon, CrownIcon, SettingsIcon, MessageCircleIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

export const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Mock team data - in real app, fetch from API
  const hasTeam = true; // Set to false to show create team flow
  
  const team = {
    id: 1,
    name: "Elite Gamers",
    tag: "EG",
    logo: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    description: "Competitive esports team focused on mobile gaming tournaments",
    founded: "Dec 2024",
    wins: 12,
    losses: 4,
    winRate: 75,
    members: [
      {
        id: 1,
        username: "ProGamer123",
        gameUsername: "ProGamer123",
        role: "Captain",
        joinDate: "Dec 2024",
        status: "Online",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
        stats: { tournaments: 8, wins: 6, winRate: 75 }
      },
      {
        id: 2,
        username: "SkillMaster",
        gameUsername: "SkillMaster_Pro",
        role: "Player",
        joinDate: "Dec 2024",
        status: "Online",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
        stats: { tournaments: 7, wins: 5, winRate: 71 }
      },
      {
        id: 3,
        username: "GameNinja",
        gameUsername: "Ninja_Gamer",
        role: "Player",
        joinDate: "Dec 2024",
        status: "Offline",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
        stats: { tournaments: 6, wins: 4, winRate: 67 }
      }
    ]
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Team created successfully!", "success");
    setShowCreateForm(false);
  };

  const handleInvitePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Invitation sent to ${inviteEmail}!`, "success");
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleLeaveTeam = () => {
    if (confirm("Are you sure you want to leave this team?")) {
      addToast("You have left the team", "info");
    }
  };

  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">Join the Competition</h1>
            <p className="text-gray-400 text-lg">Create your own team or join an existing one to participate in tournaments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Team */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#f34024] rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlusIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Create New Team</h2>
                <p className="text-gray-400 mb-6">Start your own team and invite players to join your squad</p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                >
                  Create Team
                </Button>
              </CardContent>
            </Card>

            {/* Join Team */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlusIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Join Existing Team</h2>
                <p className="text-gray-400 mb-6">Browse available teams or wait for an invitation</p>
                <Button 
                  variant="outline"
                  className="border-[#292932] text-white hover:bg-[#292932]"
                >
                  Browse Teams
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Create Team Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="bg-[#15151a] border-[#292932] w-full max-w-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Create New Team</h3>
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Team Name</label>
                      <Input
                        required
                        placeholder="Enter team name"
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Team Tag</label>
                      <Input
                        required
                        placeholder="e.g., EG"
                        maxLength={4}
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Description</label>
                      <textarea
                        placeholder="Describe your team..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                        Create Team
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setShowCreateForm(false)}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img 
                src={team.logo} 
                alt={team.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                <p className="text-[#f34024] font-medium">[{team.tag}]</p>
                <p className="text-gray-400">{team.description}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowInviteModal(true)}
                className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
              >
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Invite Player
              </Button>
              <Button 
                variant="outline"
                className="border-[#292932] text-white hover:bg-[#292932]"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-1">{team.members.length}/4</div>
              <div className="text-gray-400 text-sm">Members</div>
            </CardContent>
          </Card>
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{team.wins}</div>
              <div className="text-gray-400 text-sm">Wins</div>
            </CardContent>
          </Card>
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">{team.losses}</div>
              <div className="text-gray-400 text-sm">Losses</div>
            </CardContent>
          </Card>
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#f34024] mb-1">{team.winRate}%</div>
              <div className="text-gray-400 text-sm">Win Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members */}
          <div className="lg:col-span-2">
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Team Members</h2>
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-[#19191d] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img 
                            src={member.avatar} 
                            alt={member.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#19191d] ${
                            member.status === "Online" ? "bg-green-500" : "bg-gray-500"
                          }`}></div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{member.username}</span>
                            {member.role === "Captain" && (
                              <CrownIcon className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">{member.gameUsername}</div>
                          <div className="text-gray-500 text-xs">{member.role} • Joined {member.joinDate}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-medium">{member.stats.winRate}% WR</div>
                        <div className="text-gray-400 text-xs">{member.stats.wins}/{member.stats.tournaments} wins</div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="mt-2 border-[#292932] text-white hover:bg-[#292932]"
                        >
                          <MessageCircleIcon className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty Slot */}
                  {team.members.length < 4 && (
                    <div className="flex items-center justify-center p-4 bg-[#19191d] rounded-lg border-2 border-dashed border-[#292932]">
                      <div className="text-center">
                        <UserPlusIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <div className="text-gray-400 text-sm">Open Slot</div>
                        <Button 
                          size="sm"
                          onClick={() => setShowInviteModal(true)}
                          className="mt-2 bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                        >
                          Invite Player
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Actions & Info */}
          <div className="space-y-6">
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Team Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowInviteModal(true)}
                    className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white justify-start"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Invite Player
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-[#292932] text-white hover:bg-[#292932] justify-start"
                  >
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Team Chat
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-[#292932] text-white hover:bg-[#292932] justify-start"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Team Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Team Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founded</span>
                    <span className="text-white">{team.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Tournaments</span>
                    <span className="text-white">{team.wins + team.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Finish</span>
                    <span className="text-yellow-500">1st Place</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
                <p className="text-red-300 text-sm mb-4">
                  Leaving the team will remove you from all upcoming tournaments.
                </p>
                <Button 
                  onClick={handleLeaveTeam}
                  variant="outline"
                  className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Leave Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invite Player Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-[#15151a] border-[#292932] w-full max-w-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Invite Player</h3>
                <form onSubmit={handleInvitePlayer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Player Email or Username
                    </label>
                    <Input
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email or username"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Add a personal message..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                      Send Invite
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setShowInviteModal(false)}
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
      </div>
    </div>
  );
};