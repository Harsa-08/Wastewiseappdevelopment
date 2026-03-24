import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, MapPin, Calendar } from 'lucide-react';
import { reportsStorage, authStorage } from '../services/storage';
import { GarbageReport, ReportStatus, WasteType } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<GarbageReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<GarbageReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, wasteTypeFilter]);

  const loadReports = () => {
    const currentUser = authStorage.getCurrentUser();
    if (currentUser?.isAdmin) {
      // Admin sees all reports
      setReports(reportsStorage.getReports());
    } else {
      // Regular users see only their reports
      const userReports = reportsStorage.getUserReports(currentUser?.id || '');
      setReports(userReports);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Waste type filter
    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.wasteType === wasteTypeFilter);
    }

    setFilteredReports(filtered);
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'cleaned': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'verified': return 'bg-yellow-500';
      case 'reported': return 'bg-orange-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const groupedByStatus = {
    reported: filteredReports.filter(r => r.status === 'reported'),
    verified: filteredReports.filter(r => r.status === 'verified'),
    'in-progress': filteredReports.filter(r => r.status === 'in-progress'),
    cleaned: filteredReports.filter(r => r.status === 'cleaned'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Garbage Reports</h1>
          <p className="text-muted-foreground">Track and manage waste reports</p>
        </div>
        <Button onClick={() => navigate('/reports/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="cleaned">Cleaned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={wasteTypeFilter} onValueChange={setWasteTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Reported</p>
            <p className="text-2xl">{groupedByStatus.reported.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl">{groupedByStatus['in-progress'].length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-2xl">{groupedByStatus.verified.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cleaned</p>
            <p className="text-2xl">{groupedByStatus.cleaned.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filteredReports.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({groupedByStatus.reported.length + groupedByStatus.verified.length + groupedByStatus['in-progress'].length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({groupedByStatus.cleaned.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No reports found</p>
                <Button className="mt-4" onClick={() => navigate('/reports/new')}>
                  Create Your First Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-1 rounded-full ${getStatusColor(report.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="capitalize">
                            {report.wasteType}
                          </Badge>
                          <Badge variant={getSeverityColor(report.severity)} className="capitalize">
                            {report.severity}
                          </Badge>
                          <Badge className="capitalize">
                            {report.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        {report.creditsAwarded > 0 && (
                          <Badge variant="secondary">+{report.creditsAwarded} credits</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {report.cleanedAt && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Cleaned on {new Date(report.cleanedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3 mt-4">
          {[...groupedByStatus.reported, ...groupedByStatus.verified, ...groupedByStatus['in-progress']].map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-1 rounded-full ${getStatusColor(report.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">{report.wasteType}</Badge>
                        <Badge variant={getSeverityColor(report.severity)} className="capitalize">{report.severity}</Badge>
                        <Badge className="capitalize">{report.status.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {groupedByStatus.cleaned.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-1 rounded-full ${getStatusColor(report.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">{report.wasteType}</Badge>
                        <Badge className="capitalize">{report.status}</Badge>
                      </div>
                      <Badge variant="secondary">+{report.creditsAwarded} credits</Badge>
                    </div>
                    <p className="text-sm mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location.address}
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Cleaned on {new Date(report.cleanedAt!).toLocaleDateString()}
                    </p>
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
