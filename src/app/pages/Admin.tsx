import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { authStorage, reportsStorage, userStorage, eventsStorage } from '../services/storage';
import { GarbageReport } from '../types';
import { mockAnalytics } from '../services/mockData';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Admin() {
  const navigate = useNavigate();
  const [pendingReports, setPendingReports] = useState<GarbageReport[]>([]);
  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    const user = authStorage.getCurrentUser();
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }

    const reports = reportsStorage.getReports();
    setPendingReports(reports.filter(r => r.status === 'reported'));
  }, [navigate]);

  const handleVerifyReport = (reportId: string) => {
    reportsStorage.updateReport(reportId, {
      status: 'verified',
      verifiedBy: 'admin',
      creditsAwarded: 50
    });
    
    const report = reportsStorage.getReport(reportId);
    if (report) {
      const user = userStorage.getUser(report.userId);
      if (user) {
        userStorage.updateUser(user.id, {
          credits: user.credits + 50
        });
      }
    }

    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    toast.success('Report verified and credits awarded!');
  };

  const handleRejectReport = (reportId: string) => {
    reportsStorage.updateReport(reportId, { status: 'rejected' });
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    toast.info('Report rejected');
  };

  const handleMarkCleaned = (reportId: string) => {
    reportsStorage.updateReport(reportId, {
      status: 'cleaned',
      cleanedAt: new Date().toISOString(),
      creditsAwarded: 100
    });
    
    const report = reportsStorage.getReport(reportId);
    if (report) {
      const user = userStorage.getUser(report.userId);
      if (user) {
        userStorage.updateUser(user.id, {
          credits: user.credits + 100
        });
      }
    }

    toast.success('Report marked as cleaned!');
  };

  const COLORS = ['#16a34a', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage reports, users, and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl">{analytics.totalReports}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl">{analytics.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cleaned Reports</p>
                <p className="text-2xl">{analytics.cleanedReports}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl">{analytics.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Pending Reports ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-3 mt-4">
          {pendingReports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <p className="text-muted-foreground">No pending reports</p>
              </CardContent>
            </Card>
          ) : (
            pendingReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">{report.wasteType}</Badge>
                          <Badge variant={
                            report.severity === 'critical' ? 'destructive' :
                            report.severity === 'high' ? 'default' :
                            'secondary'
                          } className="capitalize">
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{report.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Reported by: {report.userName}</span>
                          <span>•</span>
                          <span>{report.location.address}</span>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleVerifyReport(report.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify (+50 credits)
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => handleMarkCleaned(report.id)}
                      >
                        Mark Cleaned (+100 credits)
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectReport(report.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-4">
          {/* Reports Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reports Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.reportsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.wasteByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: ${entry.count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.wasteByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Waste Collected</span>
                  <span className="text-2xl text-primary">{analytics.totalWasteCollected} kg</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Carbon Saved</span>
                  <span className="text-2xl text-green-600">{analytics.carbonSaved} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="text-2xl text-secondary">{analytics.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Active Reports</span>
                  <span className="text-2xl text-orange-600">{analytics.activeReports}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-3 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topContributors.map((contributor, index) => (
                  <div key={contributor.userId} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-primary-foreground">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">User ID: {contributor.userId}</p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {contributor.credits} credits
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
