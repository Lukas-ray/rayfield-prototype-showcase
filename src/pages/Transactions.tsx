import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, AlertTriangle, CheckCircle2, Clock, 
  ChevronDown, Filter, Search
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { transactions, getRiskLabel, RiskLevel } from '@/data/dummyData';

export default function Transactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || tx.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  // Stats
  const totalTransactions = transactions.length;
  const highRiskCount = transactions.filter(tx => tx.risk === 'high').length;
  const blockedCount = transactions.filter(tx => tx.topBlocker).length;
  const avgProgress = Math.round(
    transactions.reduce((acc, tx) => {
      const completed = tx.milestones.filter(m => m.status === 'done').length;
      return acc + (completed / tx.milestones.length) * 100;
    }, 0) / totalTransactions
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaktionen</h1>
            <p className="text-muted-foreground mt-1">Alle aktiven Kaufabwicklungen im Überblick</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                  <p className="text-sm text-muted-foreground">Aktive Transaktionen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highRiskCount}</p>
                  <p className="text-sm text-muted-foreground">Hohes Risiko</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{blockedCount}</p>
                  <p className="text-sm text-muted-foreground">Mit Blockern</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <div className="text-blue-500 font-bold text-sm">{avgProgress}%</div>
                </div>
                <div>
                  <p className="text-2xl font-bold">Ø</p>
                  <p className="text-sm text-muted-foreground">Fortschritt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Suche nach Adresse, Verkäufer, Käufer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={riskFilter === 'all' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setRiskFilter('all')}
            >
              Alle
            </Button>
            <Button 
              variant={riskFilter === 'low' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setRiskFilter('low')}
              className="gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Niedrig
            </Button>
            <Button 
              variant={riskFilter === 'medium' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setRiskFilter('medium')}
              className="gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Mittel
            </Button>
            <Button 
              variant={riskFilter === 'high' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setRiskFilter('high')}
              className="gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Hoch
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Objekt</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Nächster Meilenstein</TableHead>
                  <TableHead>Blocker</TableHead>
                  <TableHead>Risiko</TableHead>
                  <TableHead>Verantwortlich</TableHead>
                  <TableHead className="w-[100px]">Fortschritt</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(tx => {
                  const completedMilestones = tx.milestones.filter(m => m.status === 'done').length;
                  const progressPercent = Math.round((completedMilestones / tx.milestones.length) * 100);
                  const currentMilestone = tx.milestones.find(m => m.status === 'in_progress') || 
                                           tx.milestones.find(m => m.status === 'blocked');

                  return (
                    <TableRow 
                      key={tx.id} 
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => navigate(`/property/${tx.propertyId}?tab=transaction`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{tx.propertyAddress}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.sellerName} → {tx.buyerName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {currentMilestone?.name || 'In Bearbeitung'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{tx.nextMilestoneDate}</span>
                      </TableCell>
                      <TableCell>
                        {tx.topBlocker ? (
                          <div className="flex items-center gap-1 text-sm text-red-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">{tx.topBlocker}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1', getRiskColor(tx.risk))}>
                          {getRiskIcon(tx.risk)}
                          {getRiskLabel(tx.risk)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{tx.owner}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progressPercent} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}