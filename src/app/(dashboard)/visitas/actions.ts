"use server";

import { revalidatePath } from "next/cache";
import { formatDateForElSalvador } from "@/lib/dates/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SupabaseWriteClient = {
  from: (table: string) => {
    insert: (value: Record<string, unknown>) => {
      select: (columns: string) => {
        single: () => Promise<{
          data: Record<string, unknown> | null;
          error: unknown;
        }>;
      };
    };
    update: (value: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: unknown }>;
    };
  };
};

export type CreateDayPassState = {
  ok: boolean;
  message: string;
  receiptId?: string;
};

function getSafeSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") return "Error desconocido de Supabase.";

  const record = error as Record<string, unknown>;
  const code = typeof record.code === "string" ? record.code : null;
  const message = typeof record.message === "string" ? record.message : null;
  const details = typeof record.details === "string" ? record.details : null;

  return [code, message, details].filter(Boolean).join(" | ");
}

function createReceiptNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FBG-DIA-${date}-${random}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function createDayPass(
  _previousState: CreateDayPassState,
  formData: FormData,
): Promise<CreateDayPassState> {
  const visitorName = String(formData.get("visitor_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const visitDate = String(formData.get("visit_date") ?? todayISO()).trim();
  const amountValue = String(formData.get("amount") ?? "2").trim();
  const amount = Number(amountValue || 2);

  if (!visitDate || !amount || amount <= 0) {
    return {
      ok: false,
      message: "Completa una fecha válida y un monto mayor a cero.",
    };
  }

  let supabase: SupabaseWriteClient;

  try {
    supabase = createServerSupabaseClient() as unknown as SupabaseWriteClient;
  } catch (error) {
    console.error("Missing Supabase server env", error);
    return {
      ok: false,
      message: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en Vercel.",
    };
  }

  const displayName = visitorName || "Visitante del día";

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      receipt_number: createReceiptNumber(),
      client_id: null,
      membership_id: null,
      client_name: displayName,
      client_email: "visitante@fitbodygym.local",
      client_phone: phone || null,
      plan_name: "Entrada diaria",
      paid_at: visitDate,
      expires_at: visitDate,
      amount,
    })
    .select("id, receipt_number")
    .single();

  if (receiptError || !receipt?.id) {
    console.error("Error creating day pass receipt", receiptError);
    return {
      ok: false,
      message: `No se pudo crear el comprobante: ${getSafeSupabaseError(receiptError)}`,
    };
  }

  const { data: dayPass, error: dayPassError } = await supabase
    .from("day_passes")
    .insert({
      visitor_name: visitorName || null,
      phone: phone || null,
      visit_date: visitDate,
      amount,
      receipt_id: String(receipt.id),
    })
    .select("id")
    .single();

  if (dayPassError || !dayPass) {
    console.error("Error creating day pass", dayPassError);
    return {
      ok: false,
      message: `Comprobante creado, pero no se pudo registrar la visita: ${getSafeSupabaseError(dayPassError)}`,
      receiptId: String(receipt.id),
    };
  }

  revalidatePath("/visitas");
  revalidatePath("/dashboard");
  revalidatePath(`/comprobantes/${receipt.id}`);

  return {
    ok: true,
    receiptId: String(receipt.id),
    message: `Visita registrada para ${formatDateForElSalvador(visitDate)}. Comprobante ${String(receipt.receipt_number)}.`,
  };
}
