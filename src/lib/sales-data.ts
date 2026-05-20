import { createServerSupabaseClient, hasSupabaseServerEnv } from "./supabase/server";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  active: boolean;
};

export type SaleRow = {
  id: string;
  sale_number: string;
  total: number;
  sold_at: string;
};

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseServerEnv()) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("id, name, category, price, stock, min_stock, active").order("name");
  if (error) {
    console.error("Error loading products", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getTodaySales(): Promise<SaleRow[]> {
  if (!hasSupabaseServerEnv()) return [];
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sales")
    .select("id, sale_number, total, sold_at")
    .gte("sold_at", `${today}T00:00:00.000Z`)
    .lt("sold_at", `${tomorrow}T00:00:00.000Z`)
    .order("sold_at", { ascending: false });
  if (error) {
    console.error("Error loading sales", error);
    return [];
  }
  return (data ?? []) as SaleRow[];
}
