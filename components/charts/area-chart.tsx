"use client";
import {
  Area,
  AreaChart as RechartsArea,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatIDR } from "@/lib/utils";

export function GmvAreaChart({
  data,
}: {
  data: { date: string; gmv: number; commission: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsArea data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatCompact(v)} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
          formatter={(v: number, name) =>
            name === "gmv" ? [formatIDR(v), "GMV"] : [formatIDR(v), "Komisi"]
          }
        />
        <Area
          type="monotone"
          dataKey="gmv"
          stroke="#EE4D2D"
          strokeWidth={2}
          fill="url(#gmvGrad)"
        />
        <Area
          type="monotone"
          dataKey="commission"
          stroke="#16a34a"
          strokeWidth={2}
          fill="url(#comGrad)"
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
}
