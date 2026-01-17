import { TrendingUp, Eye, MousePointer, MessageSquare, Share2, Globe, Instagram, Facebook } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  },
];

export function PerformanceTab() {
  const totalViews = channelMetrics.reduce((acc, m) => acc + m.views, 0);
  const totalClicks = channelMetrics.reduce((acc, m) => acc + m.clicks, 0);
  const totalInquiries = channelMetrics.reduce((acc, m) => acc + m.inquiries, 0);
  const avgConversion = totalClicks > 0 ? ((totalInquiries / totalClicks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString('de-DE')}</p>
                <p className="text-sm text-muted-foreground">Aufrufe gesamt</p>
              </div>
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
                <p className="text-sm text-muted-foreground">Klicks gesamt</p>
              </div>
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
                <p className="text-sm text-muted-foreground">Anfragen gesamt</p>
              </div>
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
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
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
                      <TrendingUp className={`h-4 w-4 ${channel.trend < 0 ? 'rotate-180' : ''}`} />
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
  );
}
