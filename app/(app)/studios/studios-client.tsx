"use client";
import { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Users,
  UserPlus,
  UserMinus,
  Camera,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, formatIDR, initials } from "@/lib/utils";
import type { LiveSession, Profile, Studio, StudioStatus } from "@/lib/types";

interface Props {
  initialStudios: Studio[];
  initialHosts: Profile[];
  sessions: LiveSession[];
}

export function StudiosClient({ initialStudios, initialHosts, sessions }: Props) {
  const [studios, setStudios] = useState(initialStudios);
  const [hosts, setHosts] = useState(initialHosts);
  const [selectedId, setSelectedId] = useState<string | null>(initialStudios[0]?.id ?? null);
  const [addStudioOpen, setAddStudioOpen] = useState(false);
  const [addHostOpen, setAddHostOpen] = useState(false);
  const [newStudio, setNewStudio] = useState({
    name: "",
    code: "",
    location: "",
    capacity: 4,
    equipment_notes: "",
  });
  const [hostQuery, setHostQuery] = useState("");

  const selected = studios.find((s) => s.id === selectedId);
  const hostsInStudio = hosts.filter((h) => h.assigned_studio_id === selectedId);
  const hostsAvailable = hosts.filter((h) => h.assigned_studio_id !== selectedId);

  function studioStats(studioId: string) {
    const owned = sessions.filter((s) => s.studio_id === studioId);
    const live = owned.filter((s) => s.status === "live").length;
    const ended = owned.filter((s) => s.status === "ended");
    const gmv = ended.reduce((s, l) => s + l.gmv, 0);
    const hostCount = hosts.filter((h) => h.assigned_studio_id === studioId).length;
    return { live, total: owned.length, gmv, hostCount };
  }

  function handleAddStudio() {
    if (!newStudio.name || !newStudio.code) {
      toast.error("Nama dan code studio wajib diisi");
      return;
    }
    const id = `s-new-${Date.now()}`;
    setStudios((arr) => [
      ...arr,
      {
        id,
        name: newStudio.name,
        code: newStudio.code.toUpperCase(),
        location: newStudio.location || null,
        capacity: newStudio.capacity,
        equipment_notes: newStudio.equipment_notes || null,
        photo_url: `https://picsum.photos/seed/${id}/600/400`,
        status: "active",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    toast.success("Studio baru berhasil ditambahkan");
    setSelectedId(id);
    setAddStudioOpen(false);
    setNewStudio({ name: "", code: "", location: "", capacity: 4, equipment_notes: "" });
  }

  function assignHost(hostId: string) {
    if (!selectedId) return;
    setHosts((arr) =>
      arr.map((h) => (h.id === hostId ? { ...h, assigned_studio_id: selectedId } : h))
    );
    toast.success("Host berhasil di-assign ke studio");
  }

  function removeHost(hostId: string) {
    setHosts((arr) =>
      arr.map((h) => (h.id === hostId ? { ...h, assigned_studio_id: null } : h))
    );
    toast.success("Host dilepas dari studio");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Studios</h1>
          <p className="text-sm text-muted-foreground">
            {studios.length} studio · {hosts.filter((h) => h.assigned_studio_id).length} host ter-assign
          </p>
        </div>
        <Dialog open={addStudioOpen} onOpenChange={setAddStudioOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Tambah Studio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Studio Baru</DialogTitle>
              <DialogDescription>Daftarkan lokasi/setup live baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label>Nama Studio *</Label>
                  <Input
                    value={newStudio.name}
                    onChange={(e) => setNewStudio({ ...newStudio, name: e.target.value })}
                    placeholder="Studio Hotel — Jakarta"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Code *</Label>
                  <Input
                    value={newStudio.code}
                    onChange={(e) => setNewStudio({ ...newStudio, code: e.target.value })}
                    placeholder="STD-XX"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Lokasi</Label>
                <Input
                  value={newStudio.location}
                  onChange={(e) => setNewStudio({ ...newStudio, location: e.target.value })}
                  placeholder="Jl. Sudirman, Jakarta Pusat"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Kapasitas Host</Label>
                <Input
                  type="number"
                  value={newStudio.capacity}
                  onChange={(e) => setNewStudio({ ...newStudio, capacity: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Equipment / Catatan</Label>
                <Input
                  value={newStudio.equipment_notes}
                  onChange={(e) =>
                    setNewStudio({ ...newStudio, equipment_notes: e.target.value })
                  }
                  placeholder="Ring light, DSLR, mic Rode…"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddStudioOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudio}>Tambah Studio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* STUDIO LIST */}
        <div className="lg:col-span-4 space-y-3">
          {studios.map((s) => {
            const stats = studioStats(s.id);
            const isSelected = selectedId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={cn(
                  "w-full text-left rounded-lg border bg-card overflow-hidden transition-colors hover:border-shopee/50",
                  isSelected && "border-shopee ring-1 ring-shopee"
                )}
              >
                <div className="aspect-video bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.photo_url ?? ""}
                    alt={s.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <StudioStatusBadge status={s.status} />
                  </div>
                  {stats.live > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="live">
                        <span className="live-dot mr-1" /> {stats.live} Live
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm truncate">{s.name}</h3>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">
                      {s.code}
                    </Badge>
                  </div>
                  {s.location && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {s.location}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div>
                      <div className="text-muted-foreground">Hosts</div>
                      <div className="font-semibold">
                        {stats.hostCount}/{s.capacity}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lives</div>
                      <div className="font-semibold">{stats.total}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">GMV</div>
                      <div className="font-semibold text-shopee text-[11px]">
                        {formatIDR(stats.gmv)}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* STUDIO DETAIL */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="h-14 w-14 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selected.photo_url ?? ""} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg">{selected.name}</CardTitle>
                          <Badge variant="outline">{selected.code}</Badge>
                          <StudioStatusBadge status={selected.status} />
                        </div>
                        {selected.location && (
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" /> {selected.location}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat
                      label="Hosts"
                      value={`${hostsInStudio.length}/${selected.capacity}`}
                      icon={Users}
                    />
                    <Stat
                      label="Lives Total"
                      value={studioStats(selected.id).total.toString()}
                      icon={Building2}
                    />
                    <Stat
                      label="Live Now"
                      value={studioStats(selected.id).live.toString()}
                      icon={Camera}
                    />
                    <Stat
                      label="GMV"
                      value={formatIDR(studioStats(selected.id).gmv)}
                      icon={Building2}
                    />
                  </div>
                  {selected.equipment_notes && (
                    <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs">
                      <div className="font-medium text-muted-foreground mb-1">Equipment</div>
                      <div>{selected.equipment_notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" /> Host Ter-assign
                    </CardTitle>
                    <CardDescription>
                      {hostsInStudio.length} host bekerja di {selected.name}
                    </CardDescription>
                  </div>
                  <Dialog open={addHostOpen} onOpenChange={setAddHostOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" /> Tarik Host
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tarik Host ke {selected.name}</DialogTitle>
                        <DialogDescription>
                          Pilih host dari pool untuk di-assign ke studio ini
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari host…"
                          className="pl-9"
                          value={hostQuery}
                          onChange={(e) => setHostQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-96 overflow-y-auto space-y-1.5">
                        {hostsAvailable
                          .filter(
                            (h) =>
                              !hostQuery ||
                              h.full_name.toLowerCase().includes(hostQuery.toLowerCase()) ||
                              (h.shopee_username ?? "").toLowerCase().includes(hostQuery.toLowerCase())
                          )
                          .slice(0, 50)
                          .map((h) => {
                            const currentStudio = studios.find((s) => s.id === h.assigned_studio_id);
                            return (
                              <button
                                key={h.id}
                                onClick={() => {
                                  assignHost(h.id);
                                  setAddHostOpen(false);
                                  setHostQuery("");
                                }}
                                className="w-full flex items-center gap-3 rounded-md border p-2 hover:bg-accent text-left"
                              >
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={h.avatar_url ?? undefined} />
                                  <AvatarFallback>{initials(h.full_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{h.full_name}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {h.affiliate_id} · {h.shopee_username ?? "-"}
                                  </div>
                                </div>
                                {currentStudio ? (
                                  <Badge variant="outline" className="text-[10px]">
                                    {currentStudio.code}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px]">
                                    Pool
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {hostsInStudio.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Belum ada host di studio ini. Klik "Tarik Host" untuk assign.
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {hostsInStudio.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-3 rounded-md border p-2.5"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={h.avatar_url ?? undefined} />
                            <AvatarFallback>{initials(h.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{h.full_name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {h.affiliate_id} · {h.shopee_username ?? "-"}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeHost(h.id)}
                            aria-label="Lepas dari studio"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-24 text-center text-sm text-muted-foreground">
                Pilih studio untuk melihat detail
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StudioStatusBadge({ status }: { status: StudioStatus }) {
  if (status === "active") return <Badge variant="success">Active</Badge>;
  if (status === "idle") return <Badge variant="secondary">Idle</Badge>;
  return <Badge variant="warning">Maintenance</Badge>;
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}
