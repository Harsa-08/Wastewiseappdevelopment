import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Users, Plus, Clock } from 'lucide-react';
import { eventsStorage } from '../services/storage';
import { CleanupEvent } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CleanupEvent[]>([]);

  useEffect(() => {
    setEvents(eventsStorage.getEvents());
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const completedEvents = events.filter(e => e.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Cleanup Events</h1>
          <p className="text-muted-foreground">Join community cleanup drives</p>
        </div>
        <Button onClick={() => navigate('/events/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No upcoming events</p>
                <Button className="mt-4" onClick={() => navigate('/events/new')}>
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map((event) => (
              <Card 
                key={event.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-lg flex flex-col items-center justify-center text-primary-foreground">
                      <p className="text-xs">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</p>
                      <p className="text-2xl leading-none">{new Date(event.date).getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg">{event.title}</h3>
                        <Badge>+{event.creditsReward} credits</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.participants.length}/{event.maxParticipants} joined
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedEvents.map((event) => (
            <Card 
              key={event.id}
              className="hover:shadow-md transition-shadow cursor-pointer opacity-75"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</p>
                    <p className="text-2xl leading-none">{new Date(event.date).getDate()}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg">{event.title}</h3>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participants.length} participated
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location.address}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
