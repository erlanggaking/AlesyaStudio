import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GmvAreaChart } from "@/components/charts/area-chart";
import { HostBarChart } from "@/components/charts/bar-chart";
import { getDashboardStats, getLiveSessions } from "@/lib/data/queries";
import { formatCompact, formatDate, formatIDR, formatPercent, initials } from "@/lib/utils";

export default async function AnalyticsPage() {
  const stats = await getDashboardStats();
  const ended = await getLiveSessions("ended");

  const hostBars = stats.top_hosts.map((h) => ({
    name: h.host.full_name.split(" ")[0],
    gmv: h.gmv,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Insight performa studio secara mendalam</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total GMV" value={formatIDR(stats.total_gmv)} sub="30 hari terakhir" />
        <KpiCard label="Total Komisi" value={formatIDR(stats.total_commission)} sub="setelah Shopee fee" />
        <KpiCard label="Avg Conversion" value={formatPercent(stats.avg_conversion)} sub={`${stats.total_lives} session`} />
        <KpiCard label="GMV / Live" value={formatIDR(stats.total_lives ? stats.total_gmv / stats.total_lives : 0)} sub="rata-rata" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>GMV Trend (7 hari)</CardTitle>
            <CardDescription>Perbandingan GMV vs Komisi</CardDescription>
          </CardHeader>
          <CardContent>
            <GmvAreaChart data={stats.gmv_trend_7d} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GMV per Host</CardTitle>
            <CardDescription>Top 5 host bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <HostBarChart data={hostBars} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Live Sessions</CardTitle>
          <CardDescription>Performance setiap session yang sudah berakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Studio</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Viewers</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">GMV</TableHead>
                <TableHead className="text-right">Komisi</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ended.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium max-w-[260px] truncate">{s.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={s.host?.avatar_url ?? undefined} />
                        <AvatarFallback className="text-[10px]">{initials(s.host?.full_name ?? "?")}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{s.host?.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.studio?.name ?? "-"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.actual_start ? formatDate(s.actual_start, { dateStyle: "short", timeStyle: "short" }) : "-"}
                  </TableCell>
                  <TableCell className="text-right">{formatCompact(s.peak_viewers)}</TableCell>
                  <TableCell className="text-right">{s.orders_count}</TableCell>
                  <TableCell className="text-right font-semibold">{formatIDR(s.gmv)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{formatIDR(s.commission)}</TableCell>
                  <TableCell className="text-right">{formatPercent(s.conversion_rate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}
