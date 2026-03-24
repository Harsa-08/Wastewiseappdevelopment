import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Edit, Award, TrendingUp, Flame, MapPin, Calendar, Trophy } from 'lucide-react';
import { authStorage } from '../services/storage';
import { User } from '../types';
import { useNavigate } from 'react-router';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authStorage.getCurrentUser());
  }, []);

  if (!user) return null;

  const levelProgress = ((user.credits % 1000) / 1000) * 100;
  const nextLevelCredits = Math.ceil(user.credits / 1000) * 1000;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl">Profile</h1>
        <p className="text-muted-foreground">Manage your account and view stats</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-lg px-3">
                  Level {user.level}
                </Badge>
                {user.isAdmin && <Badge>Admin</Badge>}
              </div>
            </div>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{nextLevelCredits - user.credits} credits to next level</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl">{user.credits}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl">{user.streakDays}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports</p>
                <p className="text-2xl">{user.totalReports}</p>
              </div>
              <MapPin className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cleanups</p>
                <p className="text-2xl">{user.totalCleanups}</p>
              </div>
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Badges & Achievements ({user.badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.badges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No badges earned yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete activities to earn badges!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <div key={badge.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4>{badge.name}</h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/reports')}>
          <MapPin className="h-5 w-5" />
          <span>My Reports</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/events')}>
          <Calendar className="h-5 w-5" />
          <span>My Events</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/marketplace')}>
          <Trophy className="h-5 w-5" />
          <span>My Listings</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/rewards')}>
          <Award className="h-5 w-5" />
          <span>Rewards</span>
        </Button>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Member Since</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Total Reports</span>
            <span>{user.totalReports}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Total Cleanups</span>
            <span>{user.totalCleanups}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Current Level</span>
            <span>Level {user.level}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
