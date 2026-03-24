import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Award } from 'lucide-react';
import { eventsStorage, authStorage, userStorage } from '../services/storage';
import { CleanupEvent } from '../types';
import { toast } from 'sonner';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CleanupEvent | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = eventsStorage.getEvent(id);
      setEvent(eventData);
      
      const user = authStorage.getCurrentUser();
      if (eventData && user) {
        setIsParticipant(eventData.participants.some(p => p.userId === user.id));
      }
    }
  }, [id]);

  const handleJoin = () => {
    const user = authStorage.getCurrentUser();
    if (!user || !event) return;

    eventsStorage.joinEvent(event.id, user.id, user.name);
    setIsParticipant(true);
    toast.success('Successfully joined the event!');
    
    // Reload event
    const updated = eventsStorage.getEvent(event.id);
    setEvent(updated);
  };

  const handleLeave = () => {
    const user = authStorage.getCurrentUser();
    if (!user || !event) return;

    eventsStorage.leaveEvent(event.id, user.id);
    setIsParticipant(false);
    toast.info('Left the event');
    
    // Reload event
    const updated = eventsStorage.getEvent(event.id);
    setEvent(updated);
  };

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/events')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl">Event Details</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
              <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="capitalize">
                {event.status}
              </Badge>
            </div>
            <div className="text-right">
              <Badge className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                +{event.creditsReward} credits
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{event.description}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Date</p>
                <p>{new Date(event.date).toLocaleDateString('en', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Time</p>
                <p>{event.startTime} - {event.endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg md:col-span-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Location</p>
                <p>{event.location.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Participants</p>
                <p>{event.participants.length} / {event.maxParticipants}</p>
              </div>
            </div>
          </div>

          {event.status === 'upcoming' && (
            <div className="flex gap-3">
              {isParticipant ? (
                <Button variant="outline" className="flex-1" onClick={handleLeave}>
                  Leave Event
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleJoin}>
                  Join Event
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(`/map`)}>
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants ({event.participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {event.participants.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No participants yet</p>
          ) : (
            <div className="space-y-2">
              {event.participants.map((participant) => (
                <div key={participant.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                  <Avatar>
                    <AvatarFallback>{participant.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{participant.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(participant.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {participant.attended && (
                    <Badge variant="secondary">Attended</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p>{event.organizerName}</p>
              <p className="text-sm text-muted-foreground">Event Organizer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
