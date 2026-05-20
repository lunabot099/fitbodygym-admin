"use server";

import { revalidatePath } from "next/cache";
import { addMonths, formatDateForElSalvador } from "@/lib/dates/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SupabaseWriteClient = {
  from: (table: string) => {
    upsert: (
      value: Record<string, unknown>,
      options?: Record<string, unknown>,
    ) => {
      select: (columns: string) => {
        single: () => Promise<{
          data: { id: string } | null;
          error: unknown;
        }>;
      };
    };
    insert: (value: Record<string, unknown>) => {
      select: (columns: string) => {
        single: () => Promise<{
          data: { id: string; receipt_number?: string } | null;
          error: unknown;
        }>;
      };
    };
  };
};

export type CreateClientState = {
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
  return `FBG-${date}-${random}`;
}

export async function createClientWithMembership(
  _previousState: CreateClientState,
  formData: FormData,
): Promise<CreateClientState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const paidAt = String(formData.get("paid_at") ?? "").trim();
  const durationMonths = Number(formData.get("duration_months") ?? 1);
  const amountValue = String(formData.get("amount") ?? "").trim();
  const planName = durationMonths === 12 ? "1 año" : `${durationMonths} mes${durationMonths > 1 ? "es" : ""}`;
  const amount = amountValue ? Number(amountValue) : null;

  if (!fullName || !email || !paidAt || !durationMonths) {
    return {
      ok: false,
      message: "Completa nombre, correo, fecha de inscripción y tiempo.",
    };
  }

  const expiresAt = addMonths(paidAt, durationMonths);
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

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .upsert(
      {
        full_name: fullName,
        email,
        phone: phone || null,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (clientError || !client) {
    console.error("Error creating client", clientError);
    return {
      ok: false,
      message: `No se pudo guardar el cliente: ${getSafeSupabaseError(clientError)}`,
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .insert({
      client_id: client.id,
      plan_name: planName,
      paid_at: paidAt,
      expires_at: expiresAt,
      amount,
      status: "active",
    })
    .select("id")
    .single();

  if (membershipError || !membership) {
    console.error("Error creating membership", membershipError);
    return {
      ok: false,
      message: `El cliente se guardó, pero no se pudo crear la membresía: ${getSafeSupabaseError(membershipError)}`,
    };
  }

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      receipt_number: createReceiptNumber(),
      client_id: client.id,
      membership_id: membership.id,
      client_name: fullName,
      client_email: email,
      client_phone: phone || null,
      plan_name: planName,
      paid_at: paidAt,
      expires_at: expiresAt,
      amount,
    })
    .select("id, receipt_number")
    .single();

  if (receiptError || !receipt) {
    console.error("Error creating receipt", receiptError);
    return {
      ok: false,
      message: `Cliente y membresía guardados, pero no se pudo crear el comprobante: ${getSafeSupabaseError(receiptError)}`,
    };
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/membresias");
  revalidatePath(`/comprobantes/${receipt.id}`);

  return {
    ok: true,
    receiptId: receipt.id,
    message: `Cliente guardado. Vence el ${formatDateForElSalvador(expiresAt)}. Comprobante ${receipt.receipt_number}.`,
  };
}
