import { ArrowDownRight, ArrowUpRight, Building2, DollarSign, Radio, ShoppingBag, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GmvAreaChart } from "@/components/charts/area-chart";
import { getDashboardStats, getLiveSessions } from "@/lib/data/queries";
import { formatCompact, formatIDR, formatPercent, initials } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const liveNow = await getLiveSessions("live");

  const kpis = [
    {
      label: "Total GMV (30d)",
      value: formatIDR(stats.total_gmv),
      icon: DollarSign,
      delta: "+18.2%",
      up: true,
    },
    {
      label: "Komisi Affiliate",
      value: formatIDR(stats.total_commission),
      icon: ShoppingBag,
      delta: "+22.1%",
      up: true,
    },
    {
      label: "Live Sekarang",
      value: stats.active_lives.toString(),
      icon: Radio,
      delta: `${stats.total_lives} total`,
      up: true,
    },
    {
      label: "Active Hosts",
      value: stats.total_hosts.toString(),
      icon: Users,
      delta: `${stats.total_studios} studios`,
      up: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa Shopee Live studio Anda hari ini
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs flex items-center gap-1 mt-1 ${kpi.up ? "text-emerald-600" : "text-red-600"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.delta}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance 7 Hari Terakhir</CardTitle>
            <CardDescription>Trend GMV & Komisi affiliate harian</CardDescription>
          </CardHeader>
          <CardContent>
            <GmvAreaChart data={stats.gmv_trend_7d} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="live-dot" /> Live Now
            </CardTitle>
            <CardDescription>{liveNow.length} host sedang live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {liveNow.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">Belum ada live</div>
            )}
            {liveNow.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-md border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={l.host?.avatar_url ?? undefined} />
                  <AvatarFallback>{initials(l.host?.full_name ?? "?")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.host?.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.studio?.name ?? "-"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCompact(l.peak_viewers)}</div>
                  <div className="text-xs text-muted-foreground">viewers</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Hosts (GMV)</CardTitle>
            <CardDescription>Performer terbaik bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.top_hosts.map((h, i) => (
              <div key={h.host.id} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={h.host.avatar_url ?? undefined} />
                  <AvatarFallback>{initials(h.host.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{h.host.full_name}</div>
                  <div className="text-xs text-muted-foreground">{h.lives} live · conv {formatPercent(stats.avg_conversion)}</div>
                </div>
                <div className="text-right text-sm font-semibold">{formatIDR(h.gmv)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Produk paling laris di live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.top_products.map((p, i) => (
              <div key={p.product.id} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </div>
                <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.product.image_url ?? ""} alt={p.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.product.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {p.product.shopee_shop_name}
                    {p.product.is_winning && <Badge variant="winning" className="text-[10px]">Winning</Badge>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatIDR(p.gmv)}</div>
                  <div className="text-xs text-muted-foreground">{p.orders} order</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
