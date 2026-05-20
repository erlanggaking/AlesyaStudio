"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Radio,
  BarChart3,
  Users,
  Building2,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studios", label: "Studios", icon: Building2 },
  { href: "/hosts", label: "Hosts", icon: Users },
  { href: "/live", label: "Live Management", icon: Radio },
  { href: "/research", label: "Riset Produk", icon: Search },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-shopee text-white">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-sm leading-tight">Alesya Studio</div>
          <div className="text-xs text-muted-foreground">Shopee Live Mgmt</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-shopee/10 text-shopee"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t text-xs text-muted-foreground">
        <div>v0.1.0 · Demo Mode</div>
        <div className="mt-1">© Alesya Studio 2025</div>
      </div>
    </aside>
  );
}
