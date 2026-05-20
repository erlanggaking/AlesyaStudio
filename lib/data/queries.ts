// Query layer — abstraction yang serve mock data sekarang.
// Nanti tinggal swap implementation ke Supabase real query.
import type {
  DashboardStats,
  LiveCartItem,
  LiveSession,
  Product,
  ProductFilter,
  Profile,
  Studio,
} from "@/lib/types";
import {
  seedLiveCartItems,
  seedLiveSessions,
  seedProducts,
  seedProfiles,
  seedStudios,
} from "./seed";

// In-memory mutable copies
let products = [...seedProducts];
let liveSessions = [...seedLiveSessions];
let cartItems = [...seedLiveCartItems];
let profiles = [...seedProfiles];
let studios = [...seedStudios];

// ---- PRODUCTS ----
export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  let result = products.slice();

  if (filter.query) {
    const q = filter.query.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (filter.category) result = result.filter((p) => p.category === filter.category);
  if (filter.min_sold_monthly != null) result = result.filter((p) => p.sold_monthly >= filter.min_sold_monthly!);
  if (filter.max_sold_monthly != null) result = result.filter((p) => p.sold_monthly <= filter.max_sold_monthly!);
  if (filter.min_rating != null) result = result.filter((p) => p.rating >= filter.min_rating!);
  if (filter.min_reviews != null) result = result.filter((p) => p.review_count >= filter.min_reviews!);
  if (filter.min_price != null) result = result.filter((p) => p.price >= filter.min_price!);
  if (filter.max_price != null) result = result.filter((p) => p.price <= filter.max_price!);
  if (filter.min_commission != null) result = result.filter((p) => p.estimated_commission >= filter.min_commission!);
  if (filter.is_winning) result = result.filter((p) => p.is_winning);
  if (filter.status) result = result.filter((p) => p.status === filter.status);

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
    case "sold_monthly_desc":
    default:
      result.sort((a, b) => b.sold_monthly - a.sold_monthly);
  }
  return result;
}

export async function getProduct(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

// ---- STUDIOS ----
export async function getStudios(): Promise<Studio[]> {
  return studios;
}

export async function getStudio(id: string): Promise<Studio | null> {
  return studios.find((s) => s.id === id) ?? null;
}

export async function getStudioHosts(studioId: string): Promise<Profile[]> {
  return profiles.filter((p) => p.role === "host" && p.assigned_studio_id === studioId);
}

export async function assignHostToStudio(hostId: string, studioId: string | null) {
  profiles = profiles.map((p) => (p.id === hostId ? { ...p, assigned_studio_id: studioId } : p));
}

// ---- PROFILES ----
export async function getProfiles(role?: Profile["role"]): Promise<Profile[]> {
  return role ? profiles.filter((p) => p.role === role) : profiles;
}

export async function getProfile(id: string): Promise<Profile | null> {
  return profiles.find((p) => p.id === id) ?? null;
}

// ---- LIVE SESSIONS ----
export async function getLiveSessions(status?: LiveSession["status"]): Promise<LiveSession[]> {
  return status ? liveSessions.filter((l) => l.status === status) : liveSessions;
}

export async function getLiveSession(id: string): Promise<LiveSession | null> {
  return liveSessions.find((l) => l.id === id) ?? null;
}

export async function getStudioLives(studioId: string, status?: LiveSession["status"]): Promise<LiveSession[]> {
  let result = liveSessions.filter((l) => l.studio_id === studioId);
  if (status) result = result.filter((l) => l.status === status);
  return result;
}

export async function getLiveCartItems(liveId: string): Promise<LiveCartItem[]> {
  return cartItems.filter((c) => c.live_session_id === liveId).sort((a, b) => a.position - b.position);
}

// ---- Mutations ----
export async function pinCartItem(liveId: string, productId: string, isPinned: boolean) {
  cartItems = cartItems.map((c) =>
    c.live_session_id === liveId && c.product_id === productId ? { ...c, is_pinned: isPinned } : c
  );
}

export async function addProductToLiveCart(liveId: string, productId: string) {
  const existing = cartItems.find((c) => c.live_session_id === liveId && c.product_id === productId);
  if (existing) return;
  const product = products.find((p) => p.id === productId)!;
  const sessionItems = cartItems.filter((c) => c.live_session_id === liveId);
  cartItems.push({
    id: `lc-${Date.now()}`,
    live_session_id: liveId,
    product_id: productId,
    product,
    position: sessionItems.length,
    is_pinned: false,
    clicks: 0,
    orders: 0,
    revenue: 0,
    commission: 0,
    notes: null,
    created_at: new Date().toISOString(),
  });
}

export async function removeFromLiveCart(liveId: string, productId: string) {
  cartItems = cartItems.filter((c) => !(c.live_session_id === liveId && c.product_id === productId));
}

export async function stopLive(liveId: string) {
  liveSessions = liveSessions.map((l) =>
    l.id === liveId ? { ...l, status: "ended", actual_end: new Date().toISOString() } : l
  );
}

export async function shortlistProduct(productId: string, status: Product["status"]) {
  products = products.map((p) => (p.id === productId ? { ...p, status } : p));
}

// ---- Dashboard stats ----
export async function getDashboardStats(): Promise<DashboardStats> {
  const ended = liveSessions.filter((l) => l.status === "ended");
  const live = liveSessions.filter((l) => l.status === "live");
  const total_gmv = ended.reduce((s, l) => s + l.gmv, 0) + live.reduce((s, l) => s + l.gmv, 0);
  const total_commission = ended.reduce((s, l) => s + l.commission, 0) + live.reduce((s, l) => s + l.commission, 0);
  const total_lives = ended.length + live.length;
  const avg_conversion = total_lives
    ? [...ended, ...live].reduce((s, l) => s + l.conversion_rate, 0) / total_lives
    : 0;

  // 7-day GMV trend
  const trend: { date: string; gmv: number; commission: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    const dayLives = ended.filter((l) => l.actual_start?.slice(0, 10) === day);
    trend.push({
      date: day,
      gmv: dayLives.reduce((s, l) => s + l.gmv, 0),
      commission: dayLives.reduce((s, l) => s + l.commission, 0),
    });
  }

  // Top hosts
  const hostMap = new Map<string, { host: Profile; gmv: number; lives: number }>();
  for (const l of [...ended, ...live]) {
    if (!l.host) continue;
    const cur = hostMap.get(l.host.id) ?? { host: l.host, gmv: 0, lives: 0 };
    cur.gmv += l.gmv;
    cur.lives += 1;
    hostMap.set(l.host.id, cur);
  }
  const top_hosts = [...hostMap.values()].sort((a, b) => b.gmv - a.gmv).slice(0, 5);

  // Top studios
  const studioMap = new Map<string, { studio: Studio; gmv: number; lives: number }>();
  for (const l of [...ended, ...live]) {
    if (!l.studio) continue;
    const cur = studioMap.get(l.studio.id) ?? { studio: l.studio, gmv: 0, lives: 0 };
    cur.gmv += l.gmv;
    cur.lives += 1;
    studioMap.set(l.studio.id, cur);
  }
  const top_studios = [...studioMap.values()].sort((a, b) => b.gmv - a.gmv).slice(0, 5);

  // Top products from cart aggregation
  const prodMap = new Map<string, { product: Product; gmv: number; orders: number }>();
  for (const c of cartItems) {
    if (!c.product) continue;
    const cur = prodMap.get(c.product.id) ?? { product: c.product, gmv: 0, orders: 0 };
    cur.gmv += c.revenue;
    cur.orders += c.orders;
    prodMap.set(c.product.id, cur);
  }
  const top_products = [...prodMap.values()].sort((a, b) => b.gmv - a.gmv).slice(0, 5);

  return {
    total_gmv,
    total_commission,
    total_lives,
    active_lives: live.length,
    total_hosts: profiles.filter((p) => p.role === "host").length,
    total_studios: studios.length,
    active_studios: studios.filter((s) => s.status === "active").length,
    total_products: products.length,
    avg_conversion,
    gmv_trend_7d: trend,
    top_hosts,
    top_studios,
    top_products,
  };
}
