import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, MapPin } from 'lucide-react';
import { marketplaceStorage, authStorage } from '../services/storage';
import { toast } from 'sonner';

export default function MarketplaceForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, address: '' });

  const handleGetLocation = () => {
    setTimeout(() => {
      setLocation({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 999) + 1} Street, New York, NY`
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

    marketplaceStorage.createItem({
      sellerId: user.id,
      sellerName: user.name,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as any,
      price: parseFloat(formData.get('price') as string),
      images: [],
      location,
      status: 'available'
    });

    setTimeout(() => {
      toast.success('Item listed successfully!');
      navigate('/marketplace');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/marketplace')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl">List Recyclable Item</h1>
          <p className="text-muted-foreground">Sell your recyclable materials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g., Clean Plastic Bottles (PET)" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Describe the item..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantity & Price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
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
                  placeholder="Enter pickup location"
                  required
                />
                <Button type="button" onClick={handleGetLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/marketplace')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Listing...' : 'List Item'}
          </Button>
        </div>
      </form>
    </div>
  );
}
