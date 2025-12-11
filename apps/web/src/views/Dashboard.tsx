import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';
import {
  Calendar,
  Clock,
  Crown,
  Download,
  FileText,
  Filter,
  Plus,
  RotateCcw,
  Save,
  Search,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data
  const stats = {
    conversionsToday: 24,
    conversionsMonth: 456,
    totalFiles: 1234,
    storageUsed: 2.4,
    storageLimit: 10,
  };

  const recentConversions = [
    {
      id: 1,
      filename: 'quarterly-report.docx',
      type: 'Word → PDF',
      status: 'completed',
      time: '2 minutes ago',
      size: '2.4 MB',
    },
    {
      id: 2,
      filename: 'presentation-slides.pptx',
      type: 'PowerPoint → PDF',
      status: 'completed',
      time: '15 minutes ago',
      size: '8.7 MB',
    },
    {
      id: 3,
      filename: 'invoice-template.pdf',
      type: 'PDF → Images',
      status: 'processing',
      time: '1 hour ago',
      size: '1.2 MB',
    },
    {
      id: 4,
      filename: 'contract-draft.docx',
      type: 'Word → PDF',
      status: 'completed',
      time: '3 hours ago',
      size: '892 KB',
    },
  ];

  const usageData = [
    { day: 'Mon', conversions: 12 },
    { day: 'Tue', conversions: 18 },
    { day: 'Wed', conversions: 24 },
    { day: 'Thu', conversions: 15 },
    { day: 'Fri', conversions: 32 },
    { day: 'Sat', conversions: 8 },
    { day: 'Sun', conversions: 14 },
  ];

  const maxConversions = Math.max(...usageData.map(d => d.conversions));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Welcome back, Sarah</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your documents today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Conversions</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionsToday}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionsMonth}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +28% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time conversions</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.storageUsed} GB</div>
              <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.storageLimit - stats.storageUsed} GB remaining
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Usage Chart */}
          <Card className="lg:col-span-2 modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Usage</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-muted-foreground">{data.day}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-primary/20 rounded-lg relative overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-lg transition-all duration-500"
                          style={{ width: `${(data.conversions / maxConversions) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm font-medium text-right">{data.conversions}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-warning" />
                Upgrade to Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Unlock unlimited conversions and advanced features.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Unlimited file conversions
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Priority processing
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Advanced file formats
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  API access
                </div>
              </div>

              <Button variant="cta" className="w-full" asChild>
                <Link to="/pricing">Upgrade Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversions */}
        <Card className="mt-8 modern-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Conversions</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/convert">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversions.map(conversion => (
                <div
                  key={conversion.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{conversion.filename}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{conversion.type}</span>
                        <span>•</span>
                        <span>{conversion.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <Badge
                        variant={conversion.status === 'completed' ? 'default' : 'secondary'}
                        className="mb-1"
                      >
                        {conversion.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {conversion.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Convert Again">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Save">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
