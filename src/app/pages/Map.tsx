import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Navigation, Filter } from 'lucide-react';
import { reportsStorage, eventsStorage } from '../services/storage';
import { GarbageReport, CleanupEvent } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%', minHeight: '400px', borderRadius: '0.5rem' };
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 };

export default function Map() {
  const [reports, setReports] = useState<GarbageReport[]>([]);
  const [events, setEvents] = useState<CleanupEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'reports' | 'events'>('all');
  
  const [selectedReport, setSelectedReport] = useState<GarbageReport | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

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
            {/* Map */}
            <Card className="md:col-span-2 overflow-hidden">
              <CardContent className="p-0 h-[400px] relative">
                {!isLoaded ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading map...</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    {reports.map((report) => (
                      <Marker
                        key={`report-${report.id}`}
                        position={{ lat: report.location.lat, lng: report.location.lng }}
                        onClick={() => { setSelectedReport(report); setSelectedEvent(null); }}
                        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                      />
                    ))}
                    {events.map((event) => (
                      <Marker
                        key={`event-${event.id}`}
                        position={{ lat: event.location.lat, lng: event.location.lng }}
                        onClick={() => { setSelectedEvent(event); setSelectedReport(null); }}
                        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                      />
                    ))}
                    
                    {selectedReport && (
                      <InfoWindow
                        position={{ lat: selectedReport.location.lat, lng: selectedReport.location.lng }}
                        onCloseClick={() => setSelectedReport(null)}
                      >
                        <div className="p-2 max-w-[200px] text-sm text-black">
                          <p className="font-semibold mb-1">Report</p>
                          <p className="mb-1">{selectedReport.description}</p>
                          <p className="text-xs text-gray-500">{selectedReport.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}

                    {selectedEvent && (
                      <InfoWindow
                        position={{ lat: selectedEvent.location.lat, lng: selectedEvent.location.lng }}
                        onCloseClick={() => setSelectedEvent(null)}
                      >
                        <div className="p-2 max-w-[200px] text-sm text-black">
                          <p className="font-semibold mb-1">Event: {selectedEvent.title}</p>
                          <p className="text-xs text-gray-500">{selectedEvent.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
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
            <Card className="md:col-span-2 overflow-hidden">
              <CardContent className="p-0 h-[400px] relative">
                {!isLoaded ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading map...</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={10}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    {reports.map((report) => (
                      <Marker
                        key={`report-${report.id}`}
                        position={{ lat: report.location.lat, lng: report.location.lng }}
                        onClick={() => setSelectedReport(report)}
                        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                      />
                    ))}
                    {selectedReport && (
                      <InfoWindow
                        position={{ lat: selectedReport.location.lat, lng: selectedReport.location.lng }}
                        onCloseClick={() => setSelectedReport(null)}
                      >
                        <div className="p-2 max-w-[200px] text-sm text-black">
                          <p className="font-semibold mb-1">Report</p>
                          <p className="mb-1">{selectedReport.description}</p>
                          <p className="text-xs text-gray-500">{selectedReport.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
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
            <Card className="md:col-span-2 overflow-hidden">
              <CardContent className="p-0 h-[400px] relative">
                {!isLoaded ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading map...</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={10}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    {events.map((event) => (
                      <Marker
                        key={`event-${event.id}`}
                        position={{ lat: event.location.lat, lng: event.location.lng }}
                        onClick={() => setSelectedEvent(event)}
                        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                      />
                    ))}
                    {selectedEvent && (
                      <InfoWindow
                        position={{ lat: selectedEvent.location.lat, lng: selectedEvent.location.lng }}
                        onCloseClick={() => setSelectedEvent(null)}
                      >
                        <div className="p-2 max-w-[200px] text-sm text-black">
                          <p className="font-semibold mb-1">{selectedEvent.title}</p>
                          <p className="text-xs text-gray-500">{selectedEvent.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
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
