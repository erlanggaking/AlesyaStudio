"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DEMO_CREDENTIALS = {
  email: "admin@alesyastudio.id",
  password: "demo1234",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      toast.success("Login berhasil");
      router.push("/dashboard");
    } else {
      toast.error("Email atau password salah");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-shopee text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-xl leading-tight">Alesya Studio</div>
            <div className="text-xs text-muted-foreground">Shopee Live Affiliator Management</div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Masuk ke dashboard Alesya Studio Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alesyastudio.id"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              <div className="font-semibold mb-1">Demo Credentials</div>
              <div>Email: admin@alesyastudio.id</div>
              <div>Password: demo1234</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
