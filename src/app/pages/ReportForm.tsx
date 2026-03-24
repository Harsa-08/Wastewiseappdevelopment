import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, MapPin, Camera, Upload } from 'lucide-react';
import { reportsStorage, authStorage, userStorage } from '../services/storage';
import { WasteType } from '../types';
import { toast } from 'sonner';

export default function ReportForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: ''
  });

  const handleGetLocation = () => {
    toast.info('Getting your location...');
    // Simulate getting location
    setTimeout(() => {
      setLocation({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, New York, NY`
      });
      toast.success('Location detected!');
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = authStorage.getCurrentUser();

    if (!user) {
      toast.error('Please login to report waste');
      navigate('/login');
      return;
    }

    if (!location.address) {
      toast.error('Please set a location');
      setIsLoading(false);
      return;
    }

    const newReport = reportsStorage.createReport({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      location,
      wasteType: formData.get('wasteType') as WasteType,
      description: formData.get('description') as string,
      severity: formData.get('severity') as any,
      images: [],
      status: 'reported',
      creditsAwarded: 0
    });

    // Update user stats
    userStorage.updateUser(user.id, {
      totalReports: user.totalReports + 1,
      credits: user.credits + 50
    });

    setTimeout(() => {
      toast.success('Report submitted successfully! +50 credits');
      navigate('/reports');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/reports')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl">Report Garbage</h1>
          <p className="text-muted-foreground">Help keep our city clean</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Enter address manually or use GPS"
                  required
                />
                <Button type="button" onClick={handleGetLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {location.address && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {location.address}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waste Details */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wasteType">Waste Type</Label>
              <Select name="wasteType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select name="severity" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor litter</SelectItem>
                  <SelectItem value="medium">Medium - Moderate accumulation</SelectItem>
                  <SelectItem value="high">High - Significant pile</SelectItem>
                  <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the waste situation in detail..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Add photos to help verify the report</p>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Photos help us verify faster and earn you bonus credits!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/reports')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>

        {/* Reward Info */}
        <Card className="bg-accent">
          <CardContent className="p-4">
            <h4 className="text-sm mb-1">🎁 Earn Rewards</h4>
            <p className="text-xs text-muted-foreground">
              Get 50 credits for verified reports. Add photos for bonus credits!
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
