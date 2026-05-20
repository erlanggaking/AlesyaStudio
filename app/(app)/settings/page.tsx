import { AlertTriangle, Check, Key, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem & integrasi pihak ketiga</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Studio</CardTitle>
          <CardDescription>Informasi dasar studio Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nama Studio</Label>
              <Input defaultValue="Alesya Studio" />
            </div>
            <div className="space-y-1.5">
              <Label>Email Kontak</Label>
              <Input type="email" defaultValue="admin@alesyastudio.id" />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input defaultValue="+6281234567890" />
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input defaultValue="Asia/Jakarta (UTC+7)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" /> Integrasi Shopee
          </CardTitle>
          <CardDescription>
            API credentials untuk Shopee Open Platform & Affiliate Marketing API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-amber-800">
              Shopee Open Platform sedang dalam proses verifikasi. Aplikasi saat ini berjalan dalam
              mode internal studio dengan data manual & affiliate workflow.
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Shopee Open Platform App ID</Label>
            <Input placeholder="Belum tersedia" disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Shopee Affiliate Marketing API Key</Label>
            <Input placeholder="Belum tersedia" disabled />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">
              <AlertTriangle className="h-3 w-3 mr-1" /> Pending verification
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> WhatsApp Gateway (Fonnte)
          </CardTitle>
          <CardDescription>
            Untuk push command ke host (cart update, reminder live, dll)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Fonnte Token</Label>
            <Input type="password" placeholder="Masukkan API token Fonnte Anda" />
          </div>
          <div className="flex items-center gap-2">
            <Button>Simpan & Test</Button>
            <Badge variant="secondary">Not configured</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Status</CardTitle>
          <CardDescription>Kesehatan layanan & integrasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatusRow label="Database (Supabase)" status="ok" detail="Demo mode (in-memory)" />
          <StatusRow label="Authentication" status="ok" detail="Demo credentials active" />
          <StatusRow label="Shopee Open Platform" status="warn" detail="Verifikasi pending" />
          <StatusRow label="Shopee Affiliate API" status="warn" detail="Belum terdaftar" />
          <StatusRow label="WhatsApp Gateway" status="warn" detail="Belum dikonfigurasi" />
        </CardContent>
      </Card>
    </div>
  );
}

function StatusRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: "ok" | "warn" | "err";
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
      </div>
      {status === "ok" && (
        <Badge variant="success">
          <Check className="h-3 w-3 mr-1" /> Operational
        </Badge>
      )}
      {status === "warn" && <Badge variant="warning">Pending</Badge>}
      {status === "err" && <Badge variant="destructive">Down</Badge>}
    </div>
  );
}
