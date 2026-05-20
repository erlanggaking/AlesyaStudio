"use client";
import { useMemo, useState } from "react";
import { Plus, Mail, Phone, Search, Building2, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import type { LiveSession, Profile, Studio } from "@/lib/types";
import { formatIDR, initials } from "@/lib/utils";

interface Props {
  initialHosts: Profile[];
  sessions: LiveSession[];
  studios: Studio[];
}

export function HostsClient({ initialHosts, sessions, studios }: Props) {
  const [hosts, setHosts] = useState(initialHosts);
  const [query, setQuery] = useState("");
  const [studioFilter, setStudioFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newHost, setNewHost] = useState({
    full_name: "",
    email: "",
    phone: "",
    shopee_username: "",
    affiliate_id: "",
    assigned_studio_id: "",
  });

  const filtered = useMemo(() => {
    let result = hosts.slice();
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (h) =>
          h.full_name.toLowerCase().includes(q) ||
          h.email.toLowerCase().includes(q) ||
          (h.shopee_username ?? "").toLowerCase().includes(q) ||
          (h.affiliate_id ?? "").toLowerCase().includes(q)
      );
    }
    if (studioFilter === "unassigned") {
      result = result.filter((h) => !h.assigned_studio_id);
    } else if (studioFilter !== "all") {
      result = result.filter((h) => h.assigned_studio_id === studioFilter);
    }
    return result;
  }, [hosts, query, studioFilter]);

  function statsFor(hostId: string) {
    const own = sessions.filter((s) => s.host_id === hostId);
    const gmv = own.reduce((s, l) => s + l.gmv, 0);
    return { lives: own.length, gmv };
  }

  function studioOf(host: Profile): Studio | undefined {
    return studios.find((s) => s.id === host.assigned_studio_id);
  }

  function reassign(hostId: string, studioId: string) {
    const value = studioId === "none" ? null : studioId;
    setHosts((arr) =>
      arr.map((h) => (h.id === hostId ? { ...h, assigned_studio_id: value } : h))
    );
    toast.success(value ? "Host di-assign ke studio baru" : "Host dilepas dari studio");
  }

  function handleAddHost() {
    if (!newHost.full_name || !newHost.email) {
      toast.error("Nama dan email wajib diisi");
      return;
    }
    const id = `u-host-new-${Date.now()}`;
    setHosts((arr) => [
      ...arr,
      {
        id,
        full_name: newHost.full_name,
        email: newHost.email,
        phone: newHost.phone || null,
        role: "host",
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newHost.full_name)}&background=random&color=fff`,
        shopee_username: newHost.shopee_username || null,
        affiliate_id: newHost.affiliate_id || null,
        assigned_studio_id: newHost.assigned_studio_id || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    toast.success("Host baru berhasil ditambahkan");
    setAddOpen(false);
    setNewHost({ full_name: "", email: "", phone: "", shopee_username: "", affiliate_id: "", assigned_studio_id: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hosts / Affiliate Accounts</h1>
          <p className="text-sm text-muted-foreground">
            {hosts.length} akun affiliate Shopee Anda
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Tambah Host
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Host Baru</DialogTitle>
              <DialogDescription>
                Konekin akun affiliate Shopee baru ke aplikasi Anda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label>Nama Lengkap *</Label>
                <Input
                  value={newHost.full_name}
                  onChange={(e) => setNewHost({ ...newHost, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newHost.email}
                  onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
                  placeholder="john@alesyastudio.id"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Phone (WhatsApp)</Label>
                  <Input
                    value={newHost.phone}
                    onChange={(e) => setNewHost({ ...newHost, phone: e.target.value })}
                    placeholder="+628..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Shopee Username</Label>
                  <Input
                    value={newHost.shopee_username}
                    onChange={(e) => setNewHost({ ...newHost, shopee_username: e.target.value })}
                    placeholder="johndoe_live"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Affiliate ID</Label>
                  <Input
                    value={newHost.affiliate_id}
                    onChange={(e) => setNewHost({ ...newHost, affiliate_id: e.target.value })}
                    placeholder="AFF-XXX"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Assign ke Studio</Label>
                  <Select
                    value={newHost.assigned_studio_id}
                    onValueChange={(v) => setNewHost({ ...newHost, assigned_studio_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih studio" />
                    </SelectTrigger>
                    <SelectContent>
                      {studios.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHost}>Tambah Host</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, username, atau affiliate ID…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={studioFilter} onValueChange={setStudioFilter}>
              <SelectTrigger className="sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua studio</SelectItem>
                <SelectItem value="unassigned">Belum di-assign</SelectItem>
                {studios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {filtered.length} dari {hosts.length} host
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((h) => {
          const s = statsFor(h.id);
          const studio = studioOf(h);
          return (
            <Card key={h.id} className="overflow-hidden">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 h-16" />
              <CardContent className="-mt-8 pb-4">
                <Avatar className="h-14 w-14 border-4 border-background">
                  <AvatarImage src={h.avatar_url ?? undefined} />
                  <AvatarFallback>{initials(h.full_name)}</AvatarFallback>
                </Avatar>
                <div className="mt-2">
                  <h3 className="font-semibold text-sm truncate">{h.full_name}</h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                    <Mail className="h-3 w-3" /> {h.email}
                  </div>
                  {h.phone && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {h.phone}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {h.is_active ? (
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Inactive
                    </Badge>
                  )}
                  {h.affiliate_id && (
                    <Badge variant="outline" className="text-[10px]">
                      {h.affiliate_id}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="text-[10px] text-muted-foreground uppercase font-medium mb-1">
                    Studio
                  </div>
                  <Select
                    value={h.assigned_studio_id ?? "none"}
                    onValueChange={(v) => reassign(h.id, v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>
                        <span className="flex items-center gap-1.5 truncate">
                          {studio ? (
                            <>
                              <Building2 className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{studio.name}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Belum di-assign</span>
                          )}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak di-assign</SelectItem>
                      {studios.map((st) => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t text-xs">
                  <div>
                    <div className="text-muted-foreground">Lives</div>
                    <div className="font-semibold text-sm">{s.lives}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">GMV</div>
                    <div className="font-semibold text-shopee text-xs">{formatIDR(s.gmv)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada host yang cocok dengan filter
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
