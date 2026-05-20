"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Filter,
  Search,
  Star,
  TrendingUp,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Product, ProductFilter } from "@/lib/types";
import { formatCompact, formatIDR } from "@/lib/utils";

interface Props {
  initialProducts: Product[];
}

export function ResearchClient({ initialProducts }: Props) {
  const [filter, setFilter] = useState<ProductFilter>({ sort: "sold_monthly_desc" });
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  const products = useMemo(() => {
    let result = initialProducts.slice();
    const q = query.toLowerCase();
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q));
    if (filter.category) result = result.filter((p) => p.category === filter.category);
    if (filter.min_sold_monthly != null)
      result = result.filter((p) => p.sold_monthly >= filter.min_sold_monthly!);
    if (filter.min_rating != null) result = result.filter((p) => p.rating >= filter.min_rating!);
    if (filter.min_reviews != null)
      result = result.filter((p) => p.review_count >= filter.min_reviews!);
    if (filter.min_price != null) result = result.filter((p) => p.price >= filter.min_price!);
    if (filter.max_price != null) result = result.filter((p) => p.price <= filter.max_price!);
    if (filter.min_commission != null)
      result = result.filter((p) => p.estimated_commission >= filter.min_commission!);
    if (filter.is_winning) result = result.filter((p) => p.is_winning);

    switch (filter.sort) {
      case "rating_desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "commission_desc":
        result.sort((a, b) => b.estimated_commission - a.estimated_commission);
        break;
      case "newest":
        result.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
      default:
        result.sort((a, b) => b.sold_monthly - a.sold_monthly);
    }
    return result;
  }, [initialProducts, filter, query]);

  function resetFilter() {
    setFilter({ sort: "sold_monthly_desc" });
    setQuery("");
  }

  function handleImport() {
    if (!importUrl.includes("shopee.")) {
      toast.error("URL Shopee tidak valid");
      return;
    }
    toast.success("Produk berhasil di-import (demo)");
    setImportOpen(false);
    setImportUrl("");
  }

  const categories = Array.from(
    new Set(initialProducts.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riset Produk</h1>
          <p className="text-sm text-muted-foreground">
            Temukan produk winning untuk live streaming akun affiliate Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Import dari URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Produk dari Shopee</DialogTitle>
                <DialogDescription>
                  Paste URL produk Shopee, sistem akan otomatis fetch metadata produk.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="url">URL Produk Shopee</Label>
                <Input
                  id="url"
                  placeholder="https://shopee.co.id/product/..."
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Cari Produk</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nama produk…"
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori</Label>
              <Select
                value={filter.category ?? "all"}
                onValueChange={(v) =>
                  setFilter((f) => ({ ...f, category: v === "all" ? undefined : v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sort</Label>
              <Select
                value={filter.sort}
                onValueChange={(v) => setFilter((f) => ({ ...f, sort: v as ProductFilter["sort"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sold_monthly_desc">Penjualan Bulanan ↓</SelectItem>
                  <SelectItem value="rating_desc">Rating Tertinggi</SelectItem>
                  <SelectItem value="commission_desc">Komisi Tertinggi</SelectItem>
                  <SelectItem value="price_asc">Harga Terendah</SelectItem>
                  <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Min Penjualan/Bulan</Label>
              <Input
                type="number"
                placeholder="0"
                value={filter.min_sold_monthly ?? ""}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    min_sold_monthly: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Min Rating</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="4.5"
                value={filter.min_rating ?? ""}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    min_rating: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Min Review</Label>
              <Input
                type="number"
                placeholder="100"
                value={filter.min_reviews ?? ""}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    min_reviews: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Min Komisi (Rp)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={filter.min_commission ?? ""}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    min_commission: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Harga (Rp)</Label>
              <Input
                type="number"
                placeholder="500000"
                value={filter.max_price ?? ""}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    max_price: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <Button
              variant={filter.is_winning ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter((f) => ({ ...f, is_winning: !f.is_winning }))}
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> Winning Only
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{products.length} produk</span>
              <Button variant="ghost" size="sm" onClick={resetFilter}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada produk yang cocok. Coba reset filter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-square bg-muted relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url ?? ""}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.is_winning && (
          <Badge variant="winning" className="absolute top-2 left-2">
            <TrendingUp className="h-3 w-3 mr-1" /> Winning
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted-foreground truncate">
          {product.shopee_shop_name ?? "Shopee"}
        </div>
        <h3 className="font-medium text-sm line-clamp-2 mt-1 min-h-[2.5rem]">{product.name}</h3>
        <div className="text-shopee font-bold text-base mt-2">{formatIDR(product.price)}</div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          <div>
            <div className="text-muted-foreground">Sold/bln</div>
            <div className="font-semibold">{formatCompact(product.sold_monthly)}</div>
          </div>
          <div>
            <div className="text-muted-foreground flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </div>
            <div className="font-semibold">{formatCompact(product.review_count)} ulasan</div>
          </div>
          <div>
            <div className="text-muted-foreground">Komisi</div>
            <div className="font-semibold text-emerald-600">
              {formatIDR(product.estimated_commission)}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button size="sm" className="flex-1">
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Live
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={product.shopee_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka di Shopee"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
