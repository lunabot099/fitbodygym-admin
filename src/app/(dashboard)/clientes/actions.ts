"use server";

import { revalidatePath } from "next/cache";
import { addMonths } from "@/lib/dates/format";
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
    insert: (value: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
};

export type CreateClientState = {
  ok: boolean;
  message: string;
};

function getSafeSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") return "Error desconocido de Supabase.";

  const record = error as Record<string, unknown>;
  const code = typeof record.code === "string" ? record.code : null;
  const message = typeof record.message === "string" ? record.message : null;
  const details = typeof record.details === "string" ? record.details : null;

  return [code, message, details].filter(Boolean).join(" | ");
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

  const { error: membershipError } = await supabase.from("memberships").insert({
    client_id: client.id,
    plan_name: durationMonths === 12 ? "1 año" : `${durationMonths} mes${durationMonths > 1 ? "es" : ""}`,
    paid_at: paidAt,
    expires_at: expiresAt,
    amount: amountValue ? Number(amountValue) : null,
    status: "active",
  });

  if (membershipError) {
    console.error("Error creating membership", membershipError);
    return {
      ok: false,
      message: `El cliente se guardó, pero no se pudo crear la membresía: ${getSafeSupabaseError(membershipError)}`,
    };
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/membresias");

  return {
    ok: true,
    message: `Cliente guardado. Vence el ${expiresAt}.`,
  };
}
