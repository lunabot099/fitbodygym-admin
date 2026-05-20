"use server";

import { revalidatePath } from "next/cache";
import { addMonths, formatDateForElSalvador } from "@/lib/dates/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type State = { ok: boolean; message: string; receiptId?: string };
type ClientRow = { id: string; full_name: string; email: string; phone: string | null };
type MembershipRow = { id: string; expires_at: string };
type QueryBuilder = {
  select: (columns: string) => {
    eq: (column: string, value: string) => QueryBuilder;
    order: (column: string, options: Record<string, unknown>) => QueryBuilder;
    limit: (count: number) => QueryBuilder;
    single: () => Promise<{ data: unknown; error: unknown }>;
    maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  };
  eq: (column: string, value: string) => QueryBuilder;
  order: (column: string, options: Record<string, unknown>) => QueryBuilder;
  limit: (count: number) => QueryBuilder;
  single: () => Promise<{ data: unknown; error: unknown }>;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  insert: (value: Record<string, unknown>) => {
    select: (columns: string) => {
      single: () => Promise<{ data: { id: string; receipt_number?: string } | null; error: unknown }>;
    };
  };
};
type Db = { from: (table: string) => QueryBuilder };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function receiptNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FBG-REN-${date}-${random}`;
}

function err(error: unknown) {
  if (!error || typeof error !== "object") return "Error desconocido";
  const r = error as Record<string, unknown>;
  return [r.code, r.message, r.details].filter(Boolean).join(" | ");
}

export async function renewMembership(_prev: State, formData: FormData): Promise<State> {
  const clientId = String(formData.get("client_id") ?? "");
  const durationMonths = Number(formData.get("duration_months") ?? 1);
  const amountValue = String(formData.get("amount") ?? "").trim();
  const amount = amountValue ? Number(amountValue) : null;

  if (!clientId || durationMonths <= 0) {
    return { ok: false, message: "Selecciona cliente y tiempo de renovación." };
  }

  const supabase = createServerSupabaseClient() as unknown as Db;

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, full_name, email, phone")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    return { ok: false, message: `Cliente no encontrado: ${err(clientError)}` };
  }

  const typedClient = client as ClientRow;

  const { data: currentMembership } = await supabase
    .from("memberships")
    .select("id, expires_at")
    .eq("client_id", clientId)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const current = currentMembership as MembershipRow | null;
  const today = todayISO();
  const baseDate = current?.expires_at && current.expires_at > today ? current.expires_at : today;
  const expiresAt = addMonths(baseDate, durationMonths);
  const planName = durationMonths === 12 ? "1 año" : `${durationMonths} mes${durationMonths > 1 ? "es" : ""}`;

  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .insert({ client_id: clientId, plan_name: planName, paid_at: today, expires_at: expiresAt, amount, status: "active" })
    .select("id")
    .single();

  if (membershipError || !membership) {
    return { ok: false, message: `No se pudo renovar membresía: ${err(membershipError)}` };
  }

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      receipt_number: receiptNumber(),
      client_id: clientId,
      membership_id: membership.id,
      client_name: typedClient.full_name,
      client_email: typedClient.email,
      client_phone: typedClient.phone,
      plan_name: `Renovación ${planName}`,
      paid_at: today,
      expires_at: expiresAt,
      amount,
    })
    .select("id, receipt_number")
    .single();

  if (receiptError || !receipt) {
    return { ok: false, message: `Membresía renovada, pero falló comprobante: ${err(receiptError)}` };
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/membresias");
  revalidatePath(`/comprobantes/${receipt.id}`);

  return { ok: true, receiptId: String(receipt.id), message: `Renovación lista. Nuevo vencimiento: ${formatDateForElSalvador(expiresAt)}.` };
}
