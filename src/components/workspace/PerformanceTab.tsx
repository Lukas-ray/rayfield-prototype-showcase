import { useState } from 'react';
import { TrendingUp, Eye, MousePointer, MessageSquare, Share2, Globe, Instagram, Facebook, Calendar, ArrowUpRight, ArrowDownRight, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ebayLogo from '@/assets/ebay-kleinanzeigen-logo.png';

interface ChannelMetric {
  id: string;
  name: string;
  icon: React.ReactNode;
  views: number;
  clicks: number;
  inquiries: number;
  trend: number;
  isConnected: boolean;
  color: string;
}

const channelMetrics: ChannelMetric[] = [
  {
    id: 'immoscout',
    name: 'ImmoScout24',
    icon: <Globe className="h-5 w-5 text-orange-500" />,
    views: 2847,
    clicks: 312,
    inquiries: 18,
    trend: 12,
    isConnected: true,
    color: '#f97316',
  },
  {
    id: 'immowelt',
    name: 'Immowelt',
    icon: <Globe className="h-5 w-5 text-blue-500" />,
    views: 1523,
    clicks: 189,
    inquiries: 8,
    trend: -3,
    isConnected: true,
    color: '#3b82f6',
  },
  {
    id: 'ebay',
    name: 'eBay Kleinanzeigen',
    icon: <img src={ebayLogo} alt="eBay Kleinanzeigen" className="h-5 w-5 rounded" />,
    views: 892,
    clicks: 67,
    inquiries: 4,
    trend: 24,
    isConnected: true,
    color: '#22c55e',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5 text-pink-500" />,
    views: 4521,
    clicks: 234,
    inquiries: 6,
    trend: 45,
    isConnected: true,
    color: '#ec4899',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="h-5 w-5 text-blue-600" />,
    views: 0,
    clicks: 0,
    inquiries: 0,
    trend: 0,
    isConnected: false,
    color: '#2563eb',
  },
];

// Time series data for the last 14 days
const timeSeriesData = [
  { date: '03.01', views: 450, clicks: 32, inquiries: 2 },
  { date: '04.01', views: 520, clicks: 45, inquiries: 3 },
  { date: '05.01', views: 680, clicks: 58, inquiries: 4 },
  { date: '06.01', views: 590, clicks: 52, inquiries: 2 },
  { date: '07.01', views: 720, clicks: 68, inquiries: 5 },
  { date: '08.01', views: 850, clicks: 75, inquiries: 4 },
  { date: '09.01', views: 780, clicks: 62, inquiries: 3 },
  { date: '10.01', views: 920, clicks: 85, inquiries: 6 },
  { date: '11.01', views: 1050, clicks: 92, inquiries: 5 },
  { date: '12.01', views: 980, clicks: 78, inquiries: 4 },
  { date: '13.01', views: 1120, clicks: 95, inquiries: 7 },
  { date: '14.01', views: 1280, clicks: 110, inquiries: 6 },
  { date: '15.01', views: 1150, clicks: 98, inquiries: 5 },
  { date: '16.01', views: 1380, clicks: 125, inquiries: 8 },
];

// Best performing times
const hourlyData = [
  { hour: '08:00', views: 120 },
  { hour: '10:00', views: 280 },
  { hour: '12:00', views: 350 },
  { hour: '14:00', views: 420 },
  { hour: '16:00', views: 380 },
  { hour: '18:00', views: 520 },
  { hour: '20:00', views: 680 },
  { hour: '22:00', views: 290 },
];

export function PerformanceTab() {
  const [timeRange, setTimeRange] = useState('14d');
  
  const totalViews = channelMetrics.reduce((acc, m) => acc + m.views, 0);
  const totalClicks = channelMetrics.reduce((acc, m) => acc + m.clicks, 0);
  const totalInquiries = channelMetrics.reduce((acc, m) => acc + m.inquiries, 0);
  const avgConversion = totalClicks > 0 ? ((totalInquiries / totalClicks) * 100).toFixed(1) : '0';
  const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  // Pie chart data
  const pieData = channelMetrics
    .filter(m => m.isConnected && m.views > 0)
    .map(m => ({
      name: m.name,
      value: m.views,
      color: m.color,
    }));

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance-Übersicht
        </h2>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="7d">7 Tage</TabsTrigger>
            <TabsTrigger value="14d">14 Tage</TabsTrigger>
            <TabsTrigger value="30d">30 Tage</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString('de-DE')}</p>
                <p className="text-sm text-muted-foreground">Aufrufe</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +18% vs. Vorwoche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString('de-DE')}</p>
                <p className="text-sm text-muted-foreground">Klicks</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +12% vs. Vorwoche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalInquiries}</p>
                <p className="text-sm text-muted-foreground">Anfragen</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +25% vs. Vorwoche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clickThroughRate}%</p>
                <p className="text-sm text-muted-foreground">CTR</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              -2% vs. Vorwoche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgConversion}%</p>
                <p className="text-sm text-muted-foreground">Conversion</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +8% vs. Vorwoche
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Entwicklung über Zeit
            </CardTitle>
            <CardDescription>Aufrufe, Klicks und Anfragen der letzten 14 Tage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" name="Aufrufe" />
                  <Area type="monotone" dataKey="clicks" stroke="#22c55e" fillOpacity={1} fill="url(#colorClicks)" name="Klicks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Kanal-Verteilung
            </CardTitle>
            <CardDescription>Aufrufe nach Kanal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{((item.value / totalViews) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Times & Channel Performance */}
      <div className="grid grid-cols-3 gap-6">
        {/* Best Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Beste Zeiten
            </CardTitle>
            <CardDescription>Wann wird Ihr Inserat am meisten gesehen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Aufrufe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent">💡 Tipp</p>
              <p className="text-xs text-muted-foreground mt-1">
                Die meisten Aufrufe erfolgen zwischen 18:00 und 22:00 Uhr. Planen Sie Ihre Updates entsprechend.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Kanal-Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelMetrics.map((channel) => (
                <div 
                  key={channel.id} 
                  className={`p-4 rounded-lg border ${channel.isConnected ? 'bg-card' : 'bg-muted/30 opacity-60'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        {channel.icon}
                      </div>
                      <div>
                        <p className="font-medium">{channel.name}</p>
                        {!channel.isConnected && (
                          <p className="text-xs text-muted-foreground">Nicht verbunden</p>
                        )}
                      </div>
                    </div>
                    {channel.isConnected && (
                      <div className={`flex items-center gap-1 text-sm ${channel.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {channel.trend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {channel.trend >= 0 ? '+' : ''}{channel.trend}%
                      </div>
                    )}
                  </div>

                  {channel.isConnected && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Aufrufe</span>
                          <span className="font-medium">{channel.views.toLocaleString('de-DE')}</span>
                        </div>
                        <Progress value={(channel.views / 5000) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Klicks</span>
                          <span className="font-medium">{channel.clicks.toLocaleString('de-DE')}</span>
                        </div>
                        <Progress value={(channel.clicks / 500) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Anfragen</span>
                          <span className="font-medium">{channel.inquiries}</span>
                        </div>
                        <Progress value={(channel.inquiries / 20) * 100} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
