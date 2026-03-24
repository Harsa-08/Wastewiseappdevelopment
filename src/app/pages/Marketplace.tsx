import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, MapPin, Package } from 'lucide-react';
import { marketplaceStorage } from '../services/storage';
import { MarketplaceItem } from '../types';

export default function Marketplace() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    setItems(marketplaceStorage.getItems());
  }, []);

  useEffect(() => {
    let filtered = [...items];
    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }
    setFilteredItems(filtered);
  }, [items, searchTerm, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Recycling Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell recyclable materials</p>
        </div>
        <Button onClick={() => navigate('/marketplace/new')}>
          <Plus className="h-4 w-4 mr-2" />
          List Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No items found</p>
              <Button className="mt-4" onClick={() => navigate('/marketplace/new')}>
                List Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg leading-tight">{item.title}</h3>
                    <Badge variant="outline" className="capitalize flex-shrink-0">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-2xl text-primary">${item.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <Badge variant={item.status === 'available' ? 'default' : 'secondary'} className="capitalize">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                    <MapPin className="h-3 w-3" />
                    {item.location.address}
                  </div>
                  {item.status === 'available' && (
                    <Button className="w-full mt-2">Contact Seller</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
