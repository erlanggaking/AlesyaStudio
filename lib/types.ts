// Core domain types for Alesya Studio
// These mirror the Supabase schema (supabase/migrations/0001_init.sql)

export type UserRole = "admin" | "manager" | "host";
export type LiveStatus = "scheduled" | "live" | "ended" | "cancelled";
export type ProductStatus = "saved" | "shortlisted" | "archived";
export type CartCommandStatus = "queued" | "sent" | "acknowledged" | "failed";
export type StudioStatus = "active" | "idle" | "maintenance";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  shopee_username?: string | null;
  affiliate_id?: string | null;
  assigned_studio_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Studio {
  id: string;
  name: string;
  code: string; // short code e.g. STD-01
  location?: string | null;
  capacity: number; // jumlah host max
  equipment_notes?: string | null;
  photo_url?: string | null;
  status: StudioStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shopee_item_id?: string | null;
  shopee_shop_id?: string | null;
  shopee_shop_name?: string | null;
  shopee_url?: string | null;
  name: string;
  image_url?: string | null;
  category?: string | null;
  price: number;
  price_min?: number | null;
  price_max?: number | null;
  sold_total: number;
  sold_monthly: number;
  rating: number;
  review_count: number;
  stock?: number | null;
  commission_rate: number;
  estimated_commission: number;
  is_winning: boolean;
  status: ProductStatus;
  tags: string[];
  added_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveSession {
  id: string;
  title: string;
  studio_id?: string | null;
  studio?: Studio | null;
  host_id?: string | null;
  host?: Profile | null;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  actual_start?: string | null;
  actual_end?: string | null;
  status: LiveStatus;
  shopee_live_url?: string | null;
  thumbnail_url?: string | null;
  notes?: string | null;
  peak_viewers: number;
  total_viewers: number;
  orders_count: number;
  gmv: number;
  commission: number;
  conversion_rate: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  cart_items?: LiveCartItem[];
}

export interface LiveCartItem {
  id: string;
  live_session_id: string;
  product_id: string;
  product?: Product | null;
  position: number;
  is_pinned: boolean;
  clicks: number;
  orders: number;
  revenue: number;
  commission: number;
  notes?: string | null;
  created_at: string;
}

export interface CartCommand {
  id: string;
  live_session_id: string;
  product_id?: string | null;
  command_type: "pin" | "unpin" | "stop_live" | "start_live";
  status: CartCommandStatus;
  payload: Record<string, unknown>;
  issued_by?: string | null;
  issued_at: string;
  acknowledged_at?: string | null;
  error_message?: string | null;
}

export interface ChecklistItem {
  id: string;
  live_session_id: string;
  label: string;
  is_done: boolean;
  position: number;
}

export interface ActivityLog {
  id: string;
  actor_id?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ---- Filter types for product research ----
export interface ProductFilter {
  query?: string;
  category?: string;
  min_sold_monthly?: number;
  max_sold_monthly?: number;
  min_rating?: number;
  min_reviews?: number;
  min_price?: number;
  max_price?: number;
  min_commission?: number;
  is_winning?: boolean;
  status?: ProductStatus;
  sort?:
    | "sold_monthly_desc"
    | "rating_desc"
    | "price_asc"
    | "price_desc"
    | "commission_desc"
    | "newest";
}

// ---- Aggregated stats for dashboard / analytics ----
export interface DashboardStats {
  total_gmv: number;
  total_commission: number;
  total_lives: number;
  active_lives: number;
  total_hosts: number;
  total_studios: number;
  active_studios: number;
  total_products: number;
  avg_conversion: number;
  gmv_trend_7d: { date: string; gmv: number; commission: number }[];
  top_hosts: { host: Profile; gmv: number; lives: number }[];
  top_studios: { studio: Studio; gmv: number; lives: number }[];
  top_products: { product: Product; gmv: number; orders: number }[];
}
