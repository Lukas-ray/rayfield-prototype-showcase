import { useState } from 'react';
import { 
  Users, UserPlus, Shield, Mail, MoreHorizontal, 
  Crown, UserCog, Eye, Edit, Trash2, Check, X,
  Building2, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive?: string;
  properties?: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: React.ReactNode;
}

const initialRoles: Role[] = [
  {
    id: 'owner',
    name: 'Inhaber',
    description: 'Vollzugriff auf alle Funktionen und Einstellungen',
    permissions: ['Alle Berechtigungen', 'Abrechnung', 'Teammitglieder verwalten', 'Einstellungen ändern'],
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    icon: <Crown className="h-4 w-4" />,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Verwaltung von Team und Einstellungen',
    permissions: ['Teammitglieder verwalten', 'Integrationen', 'Einstellungen ändern'],
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: 'makler',
    name: 'Makler',
    description: 'Objekte verwalten und Leads bearbeiten',
    permissions: ['Objekte erstellen/bearbeiten', 'Leads verwalten', 'Veröffentlichung', 'Exposés'],
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: 'koordinator',
    name: 'Koordinator',
    description: 'Dokumente und Aufgaben koordinieren',
    permissions: ['Dokumente verwalten', 'Aufgaben', 'Termine'],
    color: 'bg-green-500/10 text-green-600 border-green-500/30',
    icon: <UserCog className="h-4 w-4" />,
  },
  {
    id: 'betrachter',
    name: 'Betrachter',
    description: 'Nur-Lese-Zugriff auf Objekte',
    permissions: ['Objekte ansehen', 'Berichte ansehen'],
    color: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
    icon: <Eye className="h-4 w-4" />,
  },
];

const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Maria Schmidt',
    email: 'maria@rayfield-immobilien.de',
    phone: '+49 89 123 456 01',
    role: 'owner',
    status: 'active',
    lastActive: 'Gerade online',
    properties: 12,
  },
  {
    id: '2',
    name: 'Thomas Weber',
    email: 'thomas@rayfield-immobilien.de',
    phone: '+49 89 123 456 02',
    role: 'admin',
    status: 'active',
    lastActive: 'Vor 2 Stunden',
    properties: 8,
  },
  {
    id: '3',
    name: 'Anna Müller',
    email: 'anna@rayfield-immobilien.de',
    phone: '+49 89 123 456 03',
    role: 'makler',
    status: 'active',
    lastActive: 'Vor 30 Minuten',
    properties: 15,
  },
  {
    id: '4',
    name: 'Felix Braun',
    email: 'felix@rayfield-immobilien.de',
    role: 'makler',
    status: 'active',
    lastActive: 'Gestern',
    properties: 6,
  },
  {
    id: '5',
    name: 'Laura Fischer',
    email: 'laura@rayfield-immobilien.de',
    role: 'koordinator',
    status: 'active',
    lastActive: 'Vor 1 Stunde',
    properties: 0,
  },
  {
    id: '6',
    name: 'neuer.makler@email.de',
    email: 'neuer.makler@email.de',
    role: 'makler',
    status: 'invited',
    lastActive: 'Einladung gesendet vor 2 Tagen',
  },
];

export function TeamTab() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [roles] = useState<Role[]>(initialRoles);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'makler' });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const getRoleById = (roleId: string) => roles.find(r => r.id === roleId);

  const handleInvite = () => {
    if (!inviteForm.email) return;
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteForm.email,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'invited',
      lastActive: 'Einladung gerade gesendet',
    };
    
    setMembers(prev => [...prev, newMember]);
    setInviteDialogOpen(false);
    setInviteForm({ email: '', role: 'makler' });
    
    toast({
      title: 'Einladung gesendet',
      description: `Eine Einladung wurde an ${inviteForm.email} gesendet.`,
    });
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast({
      title: 'Rolle geändert',
      description: 'Die Benutzerrolle wurde aktualisiert.',
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast({
      title: 'Mitglied entfernt',
      description: `${member?.name || member?.email} wurde aus dem Team entfernt.`,
    });
  };

  const handleResendInvite = (memberId: string) => {
    toast({
      title: 'Einladung erneut gesendet',
      description: 'Die Einladung wurde erneut versendet.',
    });
  };

  const activeMembers = members.filter(m => m.status === 'active');
  const invitedMembers = members.filter(m => m.status === 'invited');

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="workspace-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeMembers.length}</p>
              <p className="text-sm text-muted-foreground">Aktive Mitglieder</p>
            </div>
          </div>
        </div>
        <div className="workspace-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{invitedMembers.length}</p>
              <p className="text-sm text-muted-foreground">Ausstehende Einladungen</p>
            </div>
          </div>
        </div>
        <div className="workspace-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{members.filter(m => m.role === 'makler').length}</p>
              <p className="text-sm text-muted-foreground">Makler</p>
            </div>
          </div>
        </div>
        <div className="workspace-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roles.length}</p>
              <p className="text-sm text-muted-foreground">Rollen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Teammitglieder</h2>
          </div>
          <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Mitglied einladen
          </Button>
        </div>

        <div className="workspace-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mitglied</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objekte</TableHead>
                <TableHead>Letzte Aktivität</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(member => {
                const role = getRoleById(member.role);
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                        disabled={member.role === 'owner'}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              {role?.icon}
                              <span>{role?.name}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {roles.filter(r => r.id !== 'owner').map(r => (
                            <SelectItem key={r.id} value={r.id}>
                              <div className="flex items-center gap-2">
                                {r.icon}
                                <span>{r.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          member.status === 'active' && 'text-green-600 border-green-500/30 bg-green-500/10',
                          member.status === 'invited' && 'text-amber-600 border-amber-500/30 bg-amber-500/10',
                          member.status === 'inactive' && 'text-gray-600 border-gray-500/30 bg-gray-500/10'
                        )}
                      >
                        {member.status === 'active' && 'Aktiv'}
                        {member.status === 'invited' && 'Eingeladen'}
                        {member.status === 'inactive' && 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.properties !== undefined ? (
                        <span className="font-medium">{member.properties}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{member.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.status === 'invited' && (
                            <DropdownMenuItem onClick={() => handleResendInvite(member.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Einladung erneut senden
                            </DropdownMenuItem>
                          )}
                          {member.phone && (
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              {member.phone}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {member.role !== 'owner' && (
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Entfernen
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Roles Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Rollen & Berechtigungen</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roles.map(role => (
            <div key={role.id} className="workspace-card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role.color)}>
                    {role.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{role.name}</h3>
                      <Badge variant="secondary">
                        {members.filter(m => m.role === role.id).length} Mitglieder
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.permissions.map((permission, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teammitglied einladen</DialogTitle>
            <DialogDescription>
              Senden Sie eine Einladung per E-Mail an ein neues Teammitglied.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">E-Mail-Adresse</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="name@beispiel.de"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Rolle</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rolle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(r => r.id !== 'owner').map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        {role.icon}
                        <div>
                          <span className="font-medium">{role.name}</span>
                          <span className="text-muted-foreground ml-2">– {role.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleInvite} className="gap-2">
              <Mail className="h-4 w-4" />
              Einladung senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
