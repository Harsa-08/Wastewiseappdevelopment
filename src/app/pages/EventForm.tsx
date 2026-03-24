import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';
import { eventsStorage, authStorage } from '../services/storage';
import { toast } from 'sonner';

export default function EventForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, address: '' });

  const handleGetLocation = () => {
    setTimeout(() => {
      setLocation({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 999) + 1} Park Avenue, New York, NY`
      });
      toast.success('Location detected!');
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = authStorage.getCurrentUser();
    if (!user) return;

    eventsStorage.createEvent({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      organizerId: user.id,
      organizerName: user.name,
      location,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      maxParticipants: parseInt(formData.get('maxParticipants') as string),
      creditsReward: parseInt(formData.get('creditsReward') as string),
      status: 'upcoming'
    });

    setTimeout(() => {
      toast.success('Event created successfully!');
      navigate('/events');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/events')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl">Create Cleanup Event</h1>
          <p className="text-muted-foreground">Organize a community cleanup drive</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" placeholder="e.g., Central Park Spring Cleanup" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Describe the event..." required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" name="startTime" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" name="endTime" type="time" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <div className="flex gap-2">
                <Input
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Enter address"
                  required
                />
                <Button type="button" onClick={handleGetLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants & Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input id="maxParticipants" name="maxParticipants" type="number" defaultValue="50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditsReward">Credits Reward</Label>
              <Input id="creditsReward" name="creditsReward" type="number" defaultValue="200" required />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/events')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
