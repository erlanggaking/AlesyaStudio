"use client";
import {
  Bar,
  BarChart as RechartsBar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatIDR } from "@/lib/utils";

export function HostBarChart({ data }: { data: { name: string; gmv: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBar data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatCompact(v)} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
          formatter={(v: number) => [formatIDR(v), "GMV"]}
        />
        <Bar dataKey="gmv" fill="#EE4D2D" radius={[6, 6, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
