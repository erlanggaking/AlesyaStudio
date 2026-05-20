"use client";
import { useMemo, useState } from "react";
import {
  Pin,
  PinOff,
  Plus,
  Radio,
  Square,
  Trash2,
  TrendingUp,
  Eye,
  ShoppingCart,
  Calendar,
  Clock,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { LiveCartItem, LiveSession, Product } from "@/lib/types";
import { cn, formatCompact, formatDate, formatIDR, initials } from "@/lib/utils";

interface Props {
  sessions: LiveSession[];
  cartMap: Record<string, LiveCartItem[]>;
  productCatalog: Product[];
}

type TabValue = "live" | "scheduled" | "ended";

export function LiveClient({ sessions, cartMap: initialCartMap, productCatalog }: Props) {
  const [tab, setTab] = useState<TabValue>("live");
  const [selectedId, setSelectedId] = useState<string | null>(
    sessions.find((s) => s.status === "live")?.id ?? sessions[0]?.id ?? null
  );
  const [cartMap, setCartMap] = useState(initialCartMap);
  const [sessionState, setSessionState] = useState(sessions);
  const [stopOpen, setStopOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);

  const filteredSessions = useMemo(
    () => sessionState.filter((s) => s.status === tab),
    [sessionState, tab]
  );

  const selected = sessionState.find((s) => s.id === selectedId);
  const cart = selected ? cartMap[selected.id] ?? [] : [];

  function togglePin(productId: string) {
    if (!selected) return;
    setCartMap((m) => ({
      ...m,
      [selected.id]: m[selected.id].map((c) =>
        c.product_id === productId ? { ...c, is_pinned: !c.is_pinned } : c
      ),
    }));
    toast.success("Cart command terkirim ke host", {
      description: `Action: ${cart.find((c) => c.product_id === productId)?.is_pinned ? "Unpin" : "Pin"} produk`,
    });
  }

  function removeItem(productId: string) {
    if (!selected) return;
    setCartMap((m) => ({
      ...m,
      [selected.id]: m[selected.id].filter((c) => c.product_id !== productId),
    }));
    toast.success("Produk dihapus dari Keranjang Oren");
  }

  function addProduct(p: Product) {
    if (!selected) return;
    const existing = cart.find((c) => c.product_id === p.id);
    if (existing) {
      toast.error("Produk sudah ada di cart");
      return;
    }
    const newItem: LiveCartItem = {
      id: `lc-${Date.now()}`,
      live_session_id: selected.id,
      product_id: p.id,
      product: p,
      position: cart.length,
      is_pinned: false,
      clicks: 0,
      orders: 0,
      revenue: 0,
      commission: 0,
      notes: null,
      created_at: new Date().toISOString(),
    };
    setCartMap((m) => ({ ...m, [selected.id]: [...(m[selected.id] ?? []), newItem] }));
    toast.success(`"${p.name}" ditambahkan ke Keranjang Oren`);
    setAddProductOpen(false);
  }

  function stopLive() {
    if (!selected) return;
    setSessionState((arr) =>
      arr.map((s) => (s.id === selected.id ? { ...s, status: "ended", actual_end: new Date().toISOString() } : s))
    );
    toast.success("Live dihentikan", { description: "Signal stop terkirim ke host" });
    setStopOpen(false);
    setTab("ended");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor & control Shopee Live host Anda secara real-time
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" /> Schedule Live Baru
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="live">
            <span className="live-dot mr-2" /> Live ({sessionState.filter((s) => s.status === "live").length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({sessionState.filter((s) => s.status === "scheduled").length})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({sessionState.filter((s) => s.status === "ended").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* SESSION LIST */}
            <div className="lg:col-span-4 space-y-3">
              {filteredSessions.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    Belum ada session di kategori ini
                  </CardContent>
                </Card>
              )}
              {filteredSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    "w-full text-left rounded-lg border bg-card p-3 transition-colors hover:border-shopee/50",
                    selectedId === s.id && "border-shopee ring-1 ring-shopee"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.thumbnail_url ?? ""} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {s.status === "live" && <Badge variant="live"><span className="live-dot mr-1" /> LIVE</Badge>}
                        {s.status === "scheduled" && <Badge variant="warning">Scheduled</Badge>}
                        {s.status === "ended" && <Badge variant="secondary">Ended</Badge>}
                      </div>
                      <h3 className="font-medium text-sm mt-1 line-clamp-2">{s.title}</h3>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={s.host?.avatar_url ?? undefined} />
                          <AvatarFallback className="text-[8px]">{initials(s.host?.full_name ?? "?")}</AvatarFallback>
                        </Avatar>
                        {s.host?.full_name}
                      </div>
                      {s.status === "live" && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {formatCompact(s.peak_viewers)}</span>
                          <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {s.orders_count}</span>
                        </div>
                      )}
                      {s.status === "scheduled" && s.scheduled_start && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(s.scheduled_start)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* SESSION DETAIL */}
            <div className="lg:col-span-8">
              {selected ? (
                <SessionDetail
                  session={selected}
                  cart={cart}
                  onPin={togglePin}
                  onRemove={removeItem}
                  onAdd={() => setAddProductOpen(true)}
                  onStop={() => setStopOpen(true)}
                />
              ) : (
                <Card>
                  <CardContent className="py-24 text-center text-sm text-muted-foreground">
                    Pilih session untuk melihat detail
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* STOP LIVE CONFIRM */}
      <Dialog open={stopOpen} onOpenChange={setStopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stop Live Session?</DialogTitle>
            <DialogDescription>
              Sistem akan kirim signal stop ke host. Live akan dihentikan dan status berubah ke
              "Ended". Performance final akan disimpan ke laporan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStopOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={stopLive}>
              <Square className="h-4 w-4 mr-2" /> Stop Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD PRODUCT */}
      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        catalog={productCatalog.filter((p) => !cart.some((c) => c.product_id === p.id))}
        onPick={addProduct}
      />
    </div>
  );
}

function SessionDetail({
  session,
  cart,
  onPin,
  onRemove,
  onAdd,
  onStop,
}: {
  session: LiveSession;
  cart: LiveCartItem[];
  onPin: (productId: string) => void;
  onRemove: (productId: string) => void;
  onAdd: () => void;
  onStop: () => void;
}) {
  const isLive = session.status === "live";
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isLive && <Badge variant="live"><span className="live-dot mr-1" /> LIVE NOW</Badge>}
                {session.status === "scheduled" && <Badge variant="warning">Scheduled</Badge>}
                {session.status === "ended" && <Badge variant="secondary">Ended</Badge>}
                <Badge variant="outline">{session.studio?.name ?? "No studio"}</Badge>
              </div>
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={session.host?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-[9px]">{initials(session.host?.full_name ?? "?")}</AvatarFallback>
                </Avatar>
                {session.host?.full_name}
              </CardDescription>
            </div>
            {isLive && (
              <Button variant="destructive" onClick={onStop}>
                <Square className="h-4 w-4 mr-2" /> Stop Live
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Peak Viewers" value={formatCompact(session.peak_viewers)} icon={Eye} />
            <Stat label="Orders" value={session.orders_count.toString()} icon={ShoppingCart} />
            <Stat label="GMV" value={formatIDR(session.gmv)} icon={TrendingUp} />
            <Stat label="Komisi" value={formatIDR(session.commission)} icon={Radio} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-shopee" /> Keranjang Oren
            </CardTitle>
            <CardDescription>
              {cart.length} produk · {cart.filter((c) => c.is_pinned).length} pinned
            </CardDescription>
          </div>
          {isLive && (
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {cart.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Belum ada produk di Keranjang Oren
            </div>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3",
                item.is_pinned && "bg-orange-50 border-shopee/40"
              )}
            >
              <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.product?.image_url ?? ""} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.is_pinned && (
                    <Badge variant="winning" className="text-[10px]">
                      <Pin className="h-2.5 w-2.5 mr-1" /> Pinned
                    </Badge>
                  )}
                  <span className="font-medium text-sm truncate">{item.product?.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span>{formatIDR(item.product?.price ?? 0)}</span>
                  {isLive && (
                    <>
                      <span>· {item.clicks} clicks</span>
                      <span>· {item.orders} orders</span>
                    </>
                  )}
                  {!isLive && item.orders > 0 && <span>· Sold {item.orders}</span>}
                </div>
              </div>
              {isLive && (
                <div className="flex gap-1">
                  <Button size="icon" variant="outline" onClick={() => onPin(item.product_id)} aria-label="Toggle pin">
                    {item.is_pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => onRemove(item.product_id)} aria-label="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {isLive && cart.length > 0 && (
            <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Send className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <div>
                Setiap perubahan cart otomatis terkirim ke <strong>Live Studio</strong> host melalui WhatsApp & in-app notification.
                Audit log tersimpan untuk transparansi.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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

function AddProductDialog({
  open,
  onOpenChange,
  catalog,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  catalog: Product[];
  onPick: (p: Product) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = catalog.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Product ke Keranjang Oren</DialogTitle>
          <DialogDescription>Pilih produk dari katalog riset Anda</DialogDescription>
        </DialogHeader>
        <Input placeholder="Cari produk…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filtered.slice(0, 30).map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="w-full flex items-center gap-3 rounded-md border p-2 hover:bg-accent text-left"
            >
              <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url ?? ""} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatIDR(p.price)} · {formatCompact(p.sold_monthly)} sold/bln · komisi {formatIDR(p.estimated_commission)}
                </div>
              </div>
              {p.is_winning && (
                <Badge variant="winning" className="text-[10px]">
                  <TrendingUp className="h-2.5 w-2.5 mr-1" /> Winning
                </Badge>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
