import { useState } from 'react';
import { TrendingUp, Eye, MousePointer, MessageSquare, Globe, Instagram, Facebook, ArrowUpRight, ArrowDownRight, Euro, Users, Timer, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import ebayLogo from '@/assets/ebay-kleinanzeigen-logo.png';

interface ChannelDetail {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  isConnected: boolean;
  publishedSince: string;
  listingUrl?: string;
  metrics: {
    views: number;
    viewsTrend: number;
    uniqueVisitors: number;
    clicks: number;
    clicksTrend: number;
    ctr: number;
    inquiries: number;
    inquiriesTrend: number;
    conversionRate: number;
    avgTimeOnPage: string;
    bounceRate: number;
    saves: number;
    shares: number;
  };
  weeklyData: { day: string; views: number; clicks: number }[];
  topSources: { source: string; percent: number }[];
}

const channelDetails: ChannelDetail[] = [
  {
    id: 'immoscout',
    name: 'ImmoScout24',
    icon: <Globe className="h-6 w-6 text-orange-500" />,
    color: '#f97316',
    isConnected: true,
    publishedSince: '12.01.2024',
    listingUrl: 'https://immoscout24.de/expose/12345',
    metrics: {
      views: 2847,
      viewsTrend: 12,
      uniqueVisitors: 2103,
      clicks: 312,
      clicksTrend: 8,
      ctr: 10.96,
      inquiries: 18,
      inquiriesTrend: 25,
      conversionRate: 5.77,
      avgTimeOnPage: '2:34',
      bounceRate: 32,
      saves: 89,
      shares: 12,
    },
    weeklyData: [
      { day: 'Mo', views: 380, clicks: 42 },
      { day: 'Di', views: 420, clicks: 48 },
      { day: 'Mi', views: 395, clicks: 44 },
      { day: 'Do', views: 450, clicks: 52 },
      { day: 'Fr', views: 520, clicks: 58 },
      { day: 'Sa', views: 380, clicks: 38 },
      { day: 'So', views: 302, clicks: 30 },
    ],
    topSources: [
      { source: 'Direkt / Suche', percent: 62 },
      { source: 'Google Ads', percent: 18 },
      { source: 'Newsletter', percent: 12 },
      { source: 'Social Media', percent: 8 },
    ],
  },
  {
    id: 'immowelt',
    name: 'Immowelt',
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    color: '#3b82f6',
    isConnected: true,
    publishedSince: '12.01.2024',
    listingUrl: 'https://immowelt.de/expose/67890',
    metrics: {
      views: 1523,
      viewsTrend: -3,
      uniqueVisitors: 1245,
      clicks: 189,
      clicksTrend: 5,
      ctr: 12.41,
      inquiries: 8,
      inquiriesTrend: -10,
      conversionRate: 4.23,
      avgTimeOnPage: '1:58',
      bounceRate: 41,
      saves: 45,
      shares: 6,
    },
    weeklyData: [
      { day: 'Mo', views: 210, clicks: 26 },
      { day: 'Di', views: 225, clicks: 28 },
      { day: 'Mi', views: 198, clicks: 24 },
      { day: 'Do', views: 245, clicks: 30 },
      { day: 'Fr', views: 268, clicks: 34 },
      { day: 'Sa', views: 198, clicks: 24 },
      { day: 'So', views: 179, clicks: 23 },
    ],
    topSources: [
      { source: 'Direkt / Suche', percent: 71 },
      { source: 'Google Organic', percent: 15 },
      { source: 'Referral', percent: 14 },
    ],
  },
  {
    id: 'ebay',
    name: 'eBay Kleinanzeigen',
    icon: <img src={ebayLogo} alt="eBay Kleinanzeigen" className="h-6 w-6 rounded" />,
    color: '#22c55e',
    isConnected: true,
    publishedSince: '14.01.2024',
    listingUrl: 'https://kleinanzeigen.de/s-anzeige/12345',
    metrics: {
      views: 892,
      viewsTrend: 24,
      uniqueVisitors: 756,
      clicks: 67,
      clicksTrend: 18,
      ctr: 7.51,
      inquiries: 4,
      inquiriesTrend: 33,
      conversionRate: 5.97,
      avgTimeOnPage: '1:12',
      bounceRate: 55,
      saves: 34,
      shares: 8,
    },
    weeklyData: [
      { day: 'Mo', views: 95, clicks: 8 },
      { day: 'Di', views: 120, clicks: 10 },
      { day: 'Mi', views: 135, clicks: 11 },
      { day: 'Do', views: 142, clicks: 12 },
      { day: 'Fr', views: 158, clicks: 12 },
      { day: 'Sa', views: 132, clicks: 8 },
      { day: 'So', views: 110, clicks: 6 },
    ],
    topSources: [
      { source: 'App', percent: 58 },
      { source: 'Mobile Web', percent: 28 },
      { source: 'Desktop', percent: 14 },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-6 w-6 text-pink-500" />,
    color: '#ec4899',
    isConnected: true,
    publishedSince: '10.01.2024',
    metrics: {
      views: 4521,
      viewsTrend: 45,
      uniqueVisitors: 3890,
      clicks: 234,
      clicksTrend: 38,
      ctr: 5.18,
      inquiries: 6,
      inquiriesTrend: 50,
      conversionRate: 2.56,
      avgTimeOnPage: '0:45',
      bounceRate: 68,
      saves: 156,
      shares: 89,
    },
    weeklyData: [
      { day: 'Mo', views: 580, clicks: 28 },
      { day: 'Di', views: 620, clicks: 32 },
      { day: 'Mi', views: 690, clicks: 36 },
      { day: 'Do', views: 710, clicks: 38 },
      { day: 'Fr', views: 680, clicks: 35 },
      { day: 'Sa', views: 620, clicks: 33 },
      { day: 'So', views: 621, clicks: 32 },
    ],
    topSources: [
      { source: 'Story', percent: 42 },
      { source: 'Feed Post', percent: 35 },
      { source: 'Reels', percent: 18 },
      { source: 'Bio Link', percent: 5 },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="h-6 w-6 text-blue-600" />,
    color: '#2563eb',
    isConnected: false,
    publishedSince: '',
    metrics: {
      views: 0,
      viewsTrend: 0,
      uniqueVisitors: 0,
      clicks: 0,
      clicksTrend: 0,
      ctr: 0,
      inquiries: 0,
      inquiriesTrend: 0,
      conversionRate: 0,
      avgTimeOnPage: '0:00',
      bounceRate: 0,
      saves: 0,
      shares: 0,
    },
    weeklyData: [],
    topSources: [],
  },
];

function TrendBadge({ value, suffix = '%' }: { value: number; suffix?: string }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-xs font-medium',
      isPositive ? 'text-green-500' : 'text-red-500'
    )}>
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {isPositive ? '+' : ''}{value}{suffix}
    </span>
  );
}

function ChannelCard({ channel, isExpanded, onToggle }: { channel: ChannelDetail; isExpanded: boolean; onToggle: () => void }) {
  if (!channel.isConnected) {
    return (
      <Card className="opacity-60">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                {channel.icon}
              </div>
              <div>
                <h3 className="font-semibold">{channel.name}</h3>
                <p className="text-sm text-muted-foreground">Nicht verbunden</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Verbinden</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const m = channel.metrics;

  return (
    <Card className="overflow-hidden">
      {/* Header - Always visible */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${channel.color}15` }}>
              {channel.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{channel.name}</h3>
                <Badge variant="outline" className="text-xs">Seit {channel.publishedSince}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{m.inquiries} Anfragen · {m.views.toLocaleString('de-DE')} Aufrufe</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold">{m.ctr.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">CTR</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{m.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
              <div className="text-center">
                <p className="font-semibold flex items-center gap-1">
                  {m.viewsTrend > 0 ? '+' : ''}{m.viewsTrend}%
                  {m.viewsTrend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Trend</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t bg-muted/30">
          <CardContent className="p-4 space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">Aufrufe</span>
                </div>
                <p className="text-xl font-bold">{m.views.toLocaleString('de-DE')}</p>
                <TrendBadge value={m.viewsTrend} />
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Unique Besucher</span>
                </div>
                <p className="text-xl font-bold">{m.uniqueVisitors.toLocaleString('de-DE')}</p>
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MousePointer className="h-4 w-4" />
                  <span className="text-xs">Klicks</span>
                </div>
                <p className="text-xl font-bold">{m.clicks.toLocaleString('de-DE')}</p>
                <TrendBadge value={m.clicksTrend} />
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Anfragen</span>
                </div>
                <p className="text-xl font-bold">{m.inquiries}</p>
                <TrendBadge value={m.inquiriesTrend} />
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Timer className="h-4 w-4" />
                  <span className="text-xs">Ø Verweildauer</span>
                </div>
                <p className="text-xl font-bold">{m.avgTimeOnPage}</p>
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Absprungrate</span>
                </div>
                <p className="text-xl font-bold">{m.bounceRate}%</p>
              </div>
            </div>

            {/* Charts and Details Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Weekly Performance Chart */}
              <div className="lg:col-span-2 p-4 rounded-lg bg-card border">
                <h4 className="text-sm font-medium mb-3">Wochenübersicht</h4>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channel.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="views" fill={channel.color} radius={[4, 4, 0, 0]} name="Aufrufe" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="p-4 rounded-lg bg-card border">
                <h4 className="text-sm font-medium mb-3">Traffic-Quellen</h4>
                <div className="space-y-3">
                  {channel.topSources.map((source) => (
                    <div key={source.source}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.percent}%</span>
                      </div>
                      <Progress value={source.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <p className="font-semibold">{m.saves}</p>
                    <p className="text-xs text-muted-foreground">Gemerkt</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📤</span>
                  <div>
                    <p className="font-semibold">{m.shares}</p>
                    <p className="text-xs text-muted-foreground">Geteilt</p>
                  </div>
                </div>
              </div>
              {channel.listingUrl && (
                <Button variant="outline" size="sm" onClick={() => window.open(channel.listingUrl, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Inserat öffnen
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      )}
    </Card>
  );
}

export function PerformanceTab() {
  const [timeRange, setTimeRange] = useState('7d');
  const [expandedChannels, setExpandedChannels] = useState<string[]>(['immoscout']);

  const toggleChannel = (id: string) => {
    setExpandedChannels(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const connectedChannels = channelDetails.filter(c => c.isConnected);
  const totalViews = connectedChannels.reduce((acc, c) => acc + c.metrics.views, 0);
  const totalClicks = connectedChannels.reduce((acc, c) => acc + c.metrics.clicks, 0);
  const totalInquiries = connectedChannels.reduce((acc, c) => acc + c.metrics.inquiries, 0);
  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';
  const avgConversion = totalClicks > 0 ? ((totalInquiries / totalClicks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Kanal-Performance
          </h2>
          <p className="text-sm text-muted-foreground">{connectedChannels.length} aktive Kanäle</p>
        </div>
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
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalViews.toLocaleString('de-DE')}</p>
                <p className="text-xs text-muted-foreground">Aufrufe gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalClicks.toLocaleString('de-DE')}</p>
                <p className="text-xs text-muted-foreground">Klicks gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalInquiries}</p>
                <p className="text-xs text-muted-foreground">Anfragen gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{avgCtr}%</p>
                <p className="text-xs text-muted-foreground">Ø CTR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Euro className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold">{avgConversion}%</p>
                <p className="text-xs text-muted-foreground">Ø Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Cards */}
      <div className="space-y-4">
        {channelDetails.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isExpanded={expandedChannels.includes(channel.id)}
            onToggle={() => toggleChannel(channel.id)}
          />
        ))}
      </div>
    </div>
  );
}
