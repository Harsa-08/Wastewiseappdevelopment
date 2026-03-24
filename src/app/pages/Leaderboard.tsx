import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { userStorage, authStorage } from '../services/storage';
import { User } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRank, setUserRank] = useState<number>(0);

  useEffect(() => {
    const allUsers = userStorage.getAllUsers();
    const sorted = [...allUsers].sort((a, b) => b.credits - a.credits);
    setTopUsers(sorted);

    const user = authStorage.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const rank = sorted.findIndex(u => u.id === user.id) + 1;
      setUserRank(rank);
    }
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg">{index + 1}</span>;
  };

  const topContributors = [...topUsers].sort((a, b) => b.totalReports - a.totalReports);
  const topCleaners = [...topUsers].sort((a, b) => b.totalCleanups - a.totalCleanups);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl">Leaderboard</h1>
        <p className="text-muted-foreground">Top contributors making a difference</p>
      </div>

      {/* Current User Rank */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-primary-foreground">
                <span className="text-xl">#{userRank}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-lg">{currentUser.name}</p>
                <div className="flex gap-4 mt-1 text-sm">
                  <span>{currentUser.credits} credits</span>
                  <span>•</span>
                  <span>Level {currentUser.level}</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="credits">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="credits">By Credits</TabsTrigger>
          <TabsTrigger value="reports">By Reports</TabsTrigger>
          <TabsTrigger value="cleanups">By Cleanups</TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="mt-6 space-y-3">
          {topUsers.map((user, index) => (
            <Card 
              key={user.id} 
              className={`hover:shadow-md transition-shadow ${
                currentUser?.id === user.id ? 'border-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.name}</p>
                      {currentUser?.id === user.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{user.totalReports} reports</span>
                      <span>•</span>
                      <span>{user.totalCleanups} cleanups</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-primary">{user.credits}</p>
                    <p className="text-xs text-muted-foreground">credits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-3">
          {topContributors.map((user, index) => (
            <Card 
              key={user.id}
              className={`hover:shadow-md transition-shadow ${
                currentUser?.id === user.id ? 'border-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.name}</p>
                      {currentUser?.id === user.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Level {user.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-destructive">{user.totalReports}</p>
                    <p className="text-xs text-muted-foreground">reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cleanups" className="mt-6 space-y-3">
          {topCleaners.map((user, index) => (
            <Card 
              key={user.id}
              className={`hover:shadow-md transition-shadow ${
                currentUser?.id === user.id ? 'border-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.name}</p>
                      {currentUser?.id === user.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Level {user.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-secondary">{user.totalCleanups}</p>
                    <p className="text-xs text-muted-foreground">cleanups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Achievement Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <Trophy className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-sm text-muted-foreground">Most Credits</p>
              <p className="font-semibold">{topUsers[0]?.name || 'N/A'}</p>
              <p className="text-sm text-primary">{topUsers[0]?.credits || 0} credits</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <Award className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <p className="text-sm text-muted-foreground">Most Reports</p>
              <p className="font-semibold">{topContributors[0]?.name || 'N/A'}</p>
              <p className="text-sm text-destructive">{topContributors[0]?.totalReports || 0} reports</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Medal className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-muted-foreground">Most Cleanups</p>
              <p className="font-semibold">{topCleaners[0]?.name || 'N/A'}</p>
              <p className="text-sm text-secondary">{topCleaners[0]?.totalCleanups || 0} cleanups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
