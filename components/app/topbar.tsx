"use client";
import { Bell, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Topbar({ title }: { title?: string }) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "alesya_auth=; path=/; max-age=0; SameSite=Lax";
    toast.success("Berhasil logout");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex-1">
        {title ? (
          <h1 className="text-lg font-semibold">{title}</h1>
        ) : (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari produk, host, brand…" className="pl-9" />
          </div>
        )}
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">Yuna Admin</div>
          <div className="text-xs text-muted-foreground">admin@alesyastudio.id</div>
        </div>
        <Avatar>
          <AvatarImage src="https://ui-avatars.com/api/?name=Yuna+Admin&background=EE4D2D&color=fff" alt="Yuna" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
