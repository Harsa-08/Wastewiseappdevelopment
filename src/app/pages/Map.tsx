import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Navigation, Filter } from 'lucide-react';
import { reportsStorage, eventsStorage } from '../services/storage';
import { GarbageReport, CleanupEvent } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Map() {
  const [reports, setReports] = useState<GarbageReport[]>([]);
  const [events, setEvents] = useState<CleanupEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'reports' | 'events'>('all');

  useEffect(() => {
    setReports(reportsStorage.getReports().filter(r => r.status !== 'cleaned'));
    setEvents(eventsStorage.getEvents().filter(e => e.status === 'upcoming'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Interactive Map</h1>
          <p className="text-muted-foreground">Find garbage spots and cleanup events near you</p>
        </div>
        <Button>
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <Card className="md:col-span-2">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h3 className="text-xl mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground">
                      Map visualization showing garbage reports and cleanup events
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      In a real implementation, this would integrate with Google Maps API
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-3">
              <h3 className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                Active Reports
              </h3>
              {reports.slice(0, 5).map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize text-xs">
                            {report.wasteType}
                          </Badge>
                          <Badge className="capitalize text-xs">
                            {report.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm">{report.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {report.location.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-3">
              <h3 className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Upcoming Events
              </h3>
              {events.slice(0, 5).map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.startTime}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.location.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto text-destructive mb-4" />
                    <h3 className="text-xl mb-2">Garbage Reports Map</h3>
                    <p className="text-muted-foreground">
                      Showing {reports.length} active garbage reports
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">{report.wasteType}</Badge>
                        <Badge variant={report.severity === 'critical' ? 'destructive' : 'default'} className="capitalize">
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{report.description}</p>
                      <p className="text-xs text-muted-foreground">{report.location.address}</p>
                      <Button className="w-full mt-3" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h3 className="text-xl mb-2">Cleanup Events Map</h3>
                    <p className="text-muted-foreground">
                      Showing {events.length} upcoming cleanup events
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm mb-2">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">{event.location.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{event.participants.length}/{event.maxParticipants} joined</span>
                        <Badge>+{event.creditsReward}</Badge>
                      </div>
                      <Button className="w-full mt-3" size="sm">Join Event</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
