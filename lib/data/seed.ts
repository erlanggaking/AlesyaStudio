// Mock dataset untuk demo & development
// Realistic Indonesian Shopee Live data — Alesya Studio with 100+ affiliate accounts
import type {
  LiveCartItem,
  LiveSession,
  Product,
  Profile,
  Studio,
} from "@/lib/types";

const now = new Date();
const isoDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const isoHours = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();

// ---------- STUDIOS (lokasi/setup live) ----------
export const seedStudios: Studio[] = [
  {
    id: "s-1",
    name: "Studio Alpha — Kemang",
    code: "STD-ALPHA",
    location: "Kemang, Jakarta Selatan",
    capacity: 6,
    equipment_notes: "3x Ring light, 2x DSLR, 1x green screen, mic Rode Wireless",
    photo_url: "https://picsum.photos/seed/std1/600/400",
    status: "active",
    is_active: true,
    created_at: isoDays(-90),
    updated_at: isoDays(-1),
  },
  {
    id: "s-2",
    name: "Studio Bravo — Tangerang",
    code: "STD-BRAVO",
    location: "Gading Serpong, Tangerang",
    capacity: 4,
    equipment_notes: "2x Ring light, 2x iPhone rigs, sofa beauty setup",
    photo_url: "https://picsum.photos/seed/std2/600/400",
    status: "active",
    is_active: true,
    created_at: isoDays(-85),
    updated_at: isoDays(-1),
  },
  {
    id: "s-3",
    name: "Studio Charlie — Bekasi",
    code: "STD-CHARLIE",
    location: "Summarecon Bekasi",
    capacity: 5,
    equipment_notes: "LED panel, fashion rack, full mirror wall",
    photo_url: "https://picsum.photos/seed/std3/600/400",
    status: "active",
    is_active: true,
    created_at: isoDays(-80),
    updated_at: isoDays(-1),
  },
  {
    id: "s-4",
    name: "Studio Delta — Bandung",
    code: "STD-DELTA",
    location: "Dago, Bandung",
    capacity: 4,
    equipment_notes: "Cozy aesthetic setup, kitchen + display",
    photo_url: "https://picsum.photos/seed/std4/600/400",
    status: "idle",
    is_active: true,
    created_at: isoDays(-75),
    updated_at: isoDays(-1),
  },
  {
    id: "s-5",
    name: "Studio Echo — Surabaya",
    code: "STD-ECHO",
    location: "Pakuwon City, Surabaya",
    capacity: 6,
    equipment_notes: "Multi-zone setup, 3 backdrops bisa rotate",
    photo_url: "https://picsum.photos/seed/std5/600/400",
    status: "active",
    is_active: true,
    created_at: isoDays(-70),
    updated_at: isoDays(-1),
  },
  {
    id: "s-6",
    name: "Studio Foxtrot — Bali",
    code: "STD-FOXTROT",
    location: "Canggu, Bali",
    capacity: 3,
    equipment_notes: "Outdoor garden + indoor minimalist",
    photo_url: "https://picsum.photos/seed/std6/600/400",
    status: "maintenance",
    is_active: true,
    created_at: isoDays(-60),
    updated_at: isoDays(-1),
  },
];

// ---------- PROFILES (admin + manager + 100+ host) ----------
const hostNames = [
  "Sasha Live", "Bagas Talent", "Citra Host", "Dewi Streamer", "Egi Host",
  "Farah Live", "Gilang Talent", "Hana Streamer", "Indra Host", "Jihan Live",
  "Kiki Talent", "Lala Streamer", "Mira Live", "Nanda Talent", "Oka Host",
  "Putri Streamer", "Qila Live", "Rama Host", "Sinta Talent", "Tasya Live",
  "Umar Host", "Vina Streamer", "Wira Talent", "Xena Live", "Yana Host",
  "Zara Streamer", "Aldi Talent", "Bella Live", "Chandra Host", "Dini Streamer",
  "Erika Talent", "Faris Live", "Gita Host", "Hadi Streamer", "Intan Talent",
  "Joko Live", "Kanya Host", "Linda Streamer", "Maya Talent", "Niko Live",
  "Omar Host", "Pita Streamer", "Qori Talent", "Ridho Live", "Sari Host",
  "Tio Streamer", "Ulfa Talent", "Vino Live", "Wati Host", "Xander Streamer",
  "Yoga Talent", "Zaky Live", "Anin Host", "Bona Streamer", "Cahya Talent",
  "Dimas Live", "Echa Host", "Fina Streamer", "Galih Talent", "Hesti Live",
  "Iko Host", "Jasmine Streamer", "Krisna Talent", "Lia Live", "Mila Host",
  "Nara Streamer", "Olla Talent", "Pandu Live", "Queen Host", "Reza Streamer",
  "Salma Talent", "Tomi Live", "Ulya Host", "Vega Streamer", "Winda Talent",
  "Yuki Live", "Zidan Host", "Anya Streamer", "Bayu Talent", "Caca Live",
  "Doni Host", "Elsa Streamer", "Fajar Talent", "Ghea Live", "Heru Host",
  "Ica Streamer", "Jaka Talent", "Karin Live", "Luna Host", "Mike Streamer",
  "Nadia Talent", "Otto Live", "Pia Host", "Qila Streamer", "Rio Talent",
  "Sela Live", "Tara Host", "Ulil Streamer", "Vira Talent", "Wahyu Live",
  "Xiu Host", "Yola Streamer", "Zen Talent",
];

export const seedProfiles: Profile[] = [
  {
    id: "u-admin",
    full_name: "Yuna Admin",
    email: "admin@alesyastudio.id",
    phone: "+6281234567890",
    role: "admin",
    avatar_url: "https://ui-avatars.com/api/?name=Yuna+Admin&background=EE4D2D&color=fff",
    shopee_username: "yunaadmin",
    affiliate_id: "AFF-001",
    assigned_studio_id: null,
    is_active: true,
    created_at: isoDays(-90),
    updated_at: isoDays(-1),
  },
  {
    id: "u-mgr",
    full_name: "Rini Manager",
    email: "rini@alesyastudio.id",
    phone: "+6281234567891",
    role: "manager",
    avatar_url: "https://ui-avatars.com/api/?name=Rini+Manager&background=2D7DEE&color=fff",
    assigned_studio_id: null,
    is_active: true,
    created_at: isoDays(-80),
    updated_at: isoDays(-1),
  },
  ...hostNames.map<Profile>((name, i) => {
    // Distribute hosts across studios; some unassigned (will appear in "pool")
    const assigned =
      i < 80 ? seedStudios[i % seedStudios.length].id : null;
    return {
      id: `u-host-${i + 1}`,
      full_name: name,
      email: `${name.split(" ")[0].toLowerCase()}${i + 1}@alesyastudio.id`,
      phone: `+62812${String(10000000 + i * 137).slice(0, 8)}`,
      role: "host",
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      shopee_username: `${name.split(" ")[0].toLowerCase()}_live${i + 1}`,
      affiliate_id: `AFF-${100 + i}`,
      assigned_studio_id: assigned,
      is_active: i < 95,
      created_at: isoDays(-60 + (i % 60)),
      updated_at: isoDays(-1),
    };
  }),
];

// ---------- PRODUCTS (riset, dari macem-macem shop Shopee) ----------
const productSeed: Array<Partial<Product> & { name: string; category: string; shop: string }> = [
  { name: "Wardah Lightening Day Cream 30g", category: "Beauty", shop: "wardah_official", price: 38000, sold_monthly: 24500, rating: 4.9, review_count: 18234, is_winning: true, commission_rate: 12 },
  { name: "Wardah Acnederm Series Paket Lengkap", category: "Beauty", shop: "wardah_official", price: 145000, sold_monthly: 8900, rating: 4.8, review_count: 7820, is_winning: true, commission_rate: 12 },
  { name: "Wardah Lipstick Exclusive Matte", category: "Beauty", shop: "wardah_official", price: 65000, sold_monthly: 15200, rating: 4.9, review_count: 12340, commission_rate: 12 },
  { name: "Eiger Tas Ransel Daypack 25L Original", category: "Outdoor", shop: "eiger_official", price: 489000, sold_monthly: 1240, rating: 4.8, review_count: 980, is_winning: true, commission_rate: 8 },
  { name: "Eiger Sandal Gunung Outdoor Pria", category: "Outdoor", shop: "eiger_official", price: 285000, sold_monthly: 2100, rating: 4.7, review_count: 1540, commission_rate: 8 },
  { name: "Eiger Jaket Windbreaker Anti Air", category: "Outdoor", shop: "eiger_official", price: 425000, sold_monthly: 890, rating: 4.8, review_count: 612, commission_rate: 8 },
  { name: "Erigo T-Shirt Premium Oversize Unisex", category: "Fashion", shop: "erigo_official", price: 99000, sold_monthly: 18900, rating: 4.7, review_count: 14500, is_winning: true, commission_rate: 10 },
  { name: "Erigo Hoodie Basic Cotton Fleece", category: "Fashion", shop: "erigo_official", price: 199000, sold_monthly: 6700, rating: 4.8, review_count: 4520, commission_rate: 10 },
  { name: "Erigo Cargo Pants Trendy", category: "Fashion", shop: "erigo_official", price: 249000, sold_monthly: 3400, rating: 4.7, review_count: 2100, commission_rate: 10 },
  { name: "MS Glow Whitening Serum 20ml", category: "Beauty", shop: "msglow_id", price: 79000, sold_monthly: 32100, rating: 4.9, review_count: 28900, is_winning: true, commission_rate: 15 },
  { name: "MS Glow Acne Sunscreen SPF 30", category: "Beauty", shop: "msglow_id", price: 65000, sold_monthly: 19800, rating: 4.8, review_count: 15600, is_winning: true, commission_rate: 15 },
  { name: "MS Glow Body Lotion Whitening 250ml", category: "Beauty", shop: "msglow_id", price: 55000, sold_monthly: 12400, rating: 4.7, review_count: 9870, commission_rate: 15 },
  { name: "Kahf Activated Charcoal Face Wash", category: "Beauty", shop: "kahf_official", price: 35000, sold_monthly: 14500, rating: 4.8, review_count: 11200, is_winning: true, commission_rate: 11 },
  { name: "Kahf Refreshing Toner Men 100ml", category: "Beauty", shop: "kahf_official", price: 49000, sold_monthly: 8200, rating: 4.7, review_count: 5670, commission_rate: 11 },
  { name: "Kahf Anti Acne Moisturizer", category: "Beauty", shop: "kahf_official", price: 59000, sold_monthly: 6500, rating: 4.8, review_count: 4320, commission_rate: 11 },
  { name: "Wardah Sunscreen UV Shield SPF 50", category: "Beauty", shop: "wardah_official", price: 42000, sold_monthly: 28700, rating: 4.9, review_count: 22100, is_winning: true, commission_rate: 12 },
  { name: "Erigo Topi Bucket Hat Trendy", category: "Fashion", shop: "erigo_official", price: 89000, sold_monthly: 4500, rating: 4.6, review_count: 2890, commission_rate: 10 },
  { name: "Eiger Botol Minum Vacuum 500ml", category: "Outdoor", shop: "eiger_official", price: 165000, sold_monthly: 1800, rating: 4.8, review_count: 1240, commission_rate: 8 },
  { name: "MS Glow Men Charcoal Cleanser", category: "Beauty", shop: "msglow_id", price: 75000, sold_monthly: 5400, rating: 4.7, review_count: 3210, commission_rate: 15 },
  { name: "Kahf Roll-On Deodorant Antibacterial", category: "Beauty", shop: "kahf_official", price: 28000, sold_monthly: 11200, rating: 4.7, review_count: 8400, commission_rate: 11 },
  { name: "Scarlett Whitening Body Lotion", category: "Beauty", shop: "scarlett_id", price: 75000, sold_monthly: 41200, rating: 4.9, review_count: 35400, is_winning: true, commission_rate: 14 },
  { name: "Skintific 5x Ceramide Moisturizer", category: "Beauty", shop: "skintific_id", price: 109000, sold_monthly: 22800, rating: 4.8, review_count: 17600, is_winning: true, commission_rate: 13 },
  { name: "Somethinc Niacinamide Serum 20ml", category: "Beauty", shop: "somethinc_id", price: 99000, sold_monthly: 16500, rating: 4.8, review_count: 12300, is_winning: true, commission_rate: 12 },
  { name: "Jaket Bomber Pria Casual Premium", category: "Fashion", shop: "fashion_pro_id", price: 129000, sold_monthly: 7800, rating: 4.6, review_count: 4500, commission_rate: 9 },
  { name: "Sepatu Sneakers Pria Wanita Casual", category: "Fashion", shop: "shoes_official", price: 159000, sold_monthly: 9200, rating: 4.7, review_count: 6700, commission_rate: 10 },
];

export const seedProducts: Product[] = productSeed.map((p, i) => {
  const commission = p.commission_rate ?? 10;
  const price = p.price ?? 50000;
  return {
    id: `p-${i + 1}`,
    shopee_item_id: `${1000000 + i * 17}`,
    shopee_shop_id: p.shop,
    shopee_shop_name: p.shop,
    shopee_url: `https://shopee.co.id/product/${p.shop}/${1000000 + i * 17}`,
    name: p.name,
    image_url: `https://picsum.photos/seed/p${i + 1}/400/400`,
    category: p.category,
    price,
    price_min: price * 0.95,
    price_max: price * 1.05,
    sold_total: (p.sold_monthly ?? 1000) * 6,
    sold_monthly: p.sold_monthly ?? 1000,
    rating: p.rating ?? 4.5,
    review_count: p.review_count ?? 500,
    stock: 1000 - i * 17,
    commission_rate: commission,
    estimated_commission: Math.round((price * commission) / 100),
    is_winning: p.is_winning ?? false,
    status: "saved",
    tags: p.is_winning ? ["winning", "trending"] : [],
    added_by: "u-admin",
    created_at: isoDays(-30 + i),
    updated_at: isoDays(-1),
  };
});

// ---------- LIVE SESSIONS ----------
const liveTitles = [
  "FLASH SALE Beauty - Diskon Sampai 70%",
  "Live Outdoor Gear - Promo Akhir Bulan",
  "Style Talk - New Collection Drop",
  "Skincare Routine - Tanya Apa Aja",
  "Men Grooming Live Session",
  "Mega Sale - Borong Yuk!",
  "Daily Live Best Deals",
  "Trending Product Showcase",
];

const hostsOnly = seedProfiles.filter((p) => p.role === "host");

export const seedLiveSessions: LiveSession[] = Array.from({ length: 40 }).map((_, i) => {
  // Distribusi: 28 ended, 8 live now, 4 scheduled
  const isPast = i < 28;
  const isLiveNow = i >= 28 && i < 36;
  const isScheduled = i >= 36;
  const host = hostsOnly[i % hostsOnly.length];
  const studio = seedStudios.find((s) => s.id === host.assigned_studio_id) ?? seedStudios[i % seedStudios.length];

  const status = isLiveNow ? "live" : isScheduled ? "scheduled" : "ended";
  const start = isLiveNow
    ? isoHours(-1 - (i - 28) * 0.3)
    : isScheduled
    ? isoHours(2 + (i - 36) * 3)
    : isoDays(-(28 - i));
  const end = isPast
    ? isoDays(-(28 - i)).replace(/T(\d{2}):/, (_m, h) => `T${String(Number(h) + 2).padStart(2, "0")}:`)
    : null;

  const peak = isPast
    ? Math.round(800 + Math.random() * 4500)
    : isLiveNow
    ? Math.round(500 + Math.random() * 2200)
    : 0;
  const orders = isPast
    ? Math.round(40 + Math.random() * 280)
    : isLiveNow
    ? Math.round(8 + Math.random() * 60)
    : 0;
  const gmv = orders * (75000 + Math.random() * 150000);
  const commission = gmv * 0.1;

  return {
    id: `l-${i + 1}`,
    title: liveTitles[i % liveTitles.length],
    studio_id: studio.id,
    studio,
    host_id: host.id,
    host,
    scheduled_start: start,
    scheduled_end: end,
    actual_start: isPast || isLiveNow ? start : null,
    actual_end: isPast ? end : null,
    status,
    shopee_live_url: `https://shopee.co.id/live/${100000 + i}`,
    thumbnail_url: `https://picsum.photos/seed/live${i + 1}/600/400`,
    notes: null,
    peak_viewers: peak,
    total_viewers: peak * (isPast ? 3 : isLiveNow ? 2 : 0),
    orders_count: orders,
    gmv: Math.round(gmv),
    commission: Math.round(commission),
    conversion_rate: peak ? Number(((orders / peak) * 100).toFixed(2)) : 0,
    created_by: "u-admin",
    created_at: isoDays(-(40 - i)),
    updated_at: isoDays(-1),
  };
});

// ---------- LIVE CART ITEMS ----------
export const seedLiveCartItems: LiveCartItem[] = seedLiveSessions.flatMap((live, i) => {
  // Pick 3-5 random products per live
  const productSubset = seedProducts
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  return productSubset.map<LiveCartItem>((p, idx) => ({
    id: `lc-${i}-${idx}`,
    live_session_id: live.id,
    product_id: p.id,
    product: p,
    position: idx,
    is_pinned: idx === 0,
    clicks: live.status === "ended" ? Math.round(50 + Math.random() * 400) : live.status === "live" ? Math.round(20 + Math.random() * 100) : 0,
    orders: live.status === "ended" ? Math.round(5 + Math.random() * 40) : live.status === "live" ? Math.round(1 + Math.random() * 8) : 0,
    revenue: live.status === "ended" ? Math.round((5 + Math.random() * 40) * p.price) : 0,
    commission: live.status === "ended" ? Math.round((5 + Math.random() * 40) * p.estimated_commission) : 0,
    notes: null,
    created_at: live.created_at,
  }));
});
