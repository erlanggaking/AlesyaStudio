import { ResearchClient } from "./research-client";
import { getProducts } from "@/lib/data/queries";

export default async function ResearchPage() {
  const products = await getProducts({ sort: "sold_monthly_desc" });
  return <ResearchClient initialProducts={products} />;
}
