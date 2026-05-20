import { LiveClient } from "./live-client";
import { getLiveCartItems, getLiveSessions, getProducts } from "@/lib/data/queries";

export default async function LivePage() {
  const sessions = await getLiveSessions();
  // pre-fetch carts for live sessions
  const carts = await Promise.all(
    sessions.map(async (s) => ({ id: s.id, items: await getLiveCartItems(s.id) }))
  );
  const productCatalog = await getProducts({ sort: "sold_monthly_desc" });

  const cartMap: Record<string, typeof carts[number]["items"]> = {};
  for (const c of carts) cartMap[c.id] = c.items;

  return <LiveClient sessions={sessions} cartMap={cartMap} productCatalog={productCatalog} />;
}
