import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Plus,
  Flame,
  Trophy
} from 'lucide-react';
import { authStorage, reportsStorage, eventsStorage } from '../services/storage';
import { User, GarbageReport, CleanupEvent, Activity } from '../types';
import { mockActivities } from '../services/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recentReports, setRecentReports] = useState<GarbageReport[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CleanupEvent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const currentUser = authStorage.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Get user's recent reports
      const userReports = reportsStorage.getUserReports(currentUser.id);
      setRecentReports(userReports.slice(0, 3));

      // Get upcoming events
      const allEvents = eventsStorage.getEvents();
      const upcoming = allEvents
        .filter(e => e.status === 'upcoming' && new Date(e.date) > new Date())
        .slice(0, 3);
      setUpcomingEvents(upcoming);

      // Get recent activities
      setActivities(mockActivities.slice(0, 5));
    }
  }, []);

  if (!user) return null;

  const levelProgress = ((user.credits % 1000) / 1000) * 100;
  const nextLevelCredits = Math.ceil(user.credits / 1000) * 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl">Welcome back, {user.name}! 👋</h1>
        <p className="text-muted-foreground">
          Let's make our city cleaner today
        </p>
      </div>

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
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl">{user.level}</p>
              </div>
              <Trophy className="h-8 w-8 text-secondary" />
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
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level Progress</span>
            <Badge variant="secondary">Level {user.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={levelProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {nextLevelCredits - user.credits} credits to Level {user.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="h-24 flex flex-col gap-2"
          onClick={() => navigate('/reports/new')}
        >
          <Plus className="h-6 w-6" />
          <span>Report Waste</span>
        </Button>
        <Button 
          className="h-24 flex flex-col gap-2"
          variant="secondary"
          onClick={() => navigate('/map')}
        >
          <MapPin className="h-6 w-6" />
          <span>View Map</span>
        </Button>
        <Button 
          className="h-24 flex flex-col gap-2"
          variant="outline"
          onClick={() => navigate('/events')}
        >
          <Calendar className="h-6 w-6" />
          <span>Join Event</span>
        </Button>
        <Button 
          className="h-24 flex flex-col gap-2"
          variant="outline"
          onClick={() => navigate('/rewards')}
        >
          <Award className="h-6 w-6" />
          <span>Rewards</span>
        </Button>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Recent Reports</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/reports')}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reports yet</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/reports/new')}
              >
                Create Your First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div 
                  key={report.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => navigate('/reports')}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    report.status === 'cleaned' ? 'bg-green-500' :
                    report.status === 'in-progress' ? 'bg-blue-500' :
                    report.status === 'verified' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {report.wasteType}
                      </Badge>
                      <Badge 
                        variant={
                          report.status === 'cleaned' ? 'default' :
                          report.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report.location.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Upcoming Events</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/events')}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No upcoming events</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <Calendar className="h-10 w-10 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()} • {event.startTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.participants.length}/{event.maxParticipants} participants
                    </p>
                  </div>
                  <Badge className="flex-shrink-0">+{event.creditsReward} credits</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'report' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'cleanup' ? 'bg-green-100 text-green-600' :
                  activity.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'report' ? <AlertCircle className="h-5 w-5" /> :
                   activity.type === 'cleanup' ? <Calendar className="h-5 w-5" /> :
                   activity.type === 'badge' ? <Award className="h-5 w-5" /> :
                   <TrendingUp className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">+{activity.credits}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
