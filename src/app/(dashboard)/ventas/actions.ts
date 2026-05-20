"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type State = { ok: boolean; message: string };
type ProductRow = { id: string; name: string; price: number; stock: number };
type SaleRow = { id: string };
type QueryBuilder = {
  insert: (value: Record<string, unknown>) => Promise<{ error: unknown }> & {
    select: (columns: string) => { single: () => Promise<{ data: SaleRow | null; error: unknown }> };
  };
  select: (columns: string) => {
    eq: (column: string, value: string) => { single: () => Promise<{ data: ProductRow | null; error: unknown }> };
  };
  update: (value: Record<string, unknown>) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
};
type Db = { from: (table: string) => QueryBuilder };

function saleNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FBG-V-${date}-${random}`;
}

function err(error: unknown) {
  if (!error || typeof error !== "object") return "Error desconocido";
  const r = error as Record<string, unknown>;
  return [r.code, r.message, r.details].filter(Boolean).join(" | ");
}

export async function createProduct(_prev: State, formData: FormData): Promise<State> {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "Bebidas").trim() || "Bebidas";
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const minStock = Number(formData.get("min_stock") ?? 0);

  if (!name || price <= 0) return { ok: false, message: "Completa nombre y precio." };

  const supabase = createServerSupabaseClient() as unknown as Db;
  const { error } = await supabase.from("products").insert({ name, category, price, stock, min_stock: minStock, active: true });
  if (error) return { ok: false, message: `No se pudo crear producto: ${err(error)}` };

  revalidatePath("/ventas");
  return { ok: true, message: "Producto creado." };
}

export async function registerSale(_prev: State, formData: FormData): Promise<State> {
  const productId = String(formData.get("product_id") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!productId || quantity <= 0) return { ok: false, message: "Selecciona producto y cantidad válida." };

  const supabase = createServerSupabaseClient() as unknown as Db;
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .eq("id", productId)
    .single();

  if (productError || !product) return { ok: false, message: `Producto no encontrado: ${err(productError)}` };
  if (Number(product.stock) < quantity) return { ok: false, message: "No hay suficiente stock." };

  const subtotal = Number(product.price) * quantity;
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({ sale_number: saleNumber(), total: subtotal })
    .select("id")
    .single();

  if (saleError || !sale) return { ok: false, message: `No se pudo crear la venta: ${err(saleError)}` };

  const { error: itemError } = await supabase.from("sale_items").insert({
    sale_id: sale.id,
    product_id: product.id,
    product_name: product.name,
    quantity,
    unit_price: product.price,
    subtotal,
  });
  if (itemError) return { ok: false, message: `Venta creada, pero falló el detalle: ${err(itemError)}` };

  const { error: stockError } = await supabase
    .from("products")
    .update({ stock: Number(product.stock) - quantity, updated_at: new Date().toISOString() })
    .eq("id", product.id);
  if (stockError) return { ok: false, message: `Venta creada, pero falló stock: ${err(stockError)}` };

  await supabase.from("inventory_movements").insert({ product_id: product.id, type: "sale", quantity: -quantity, notes: `Venta ${sale.id}` });

  revalidatePath("/ventas");
  revalidatePath("/dashboard");
  return { ok: true, message: `Venta registrada: $${subtotal.toFixed(2)}.` };
}
