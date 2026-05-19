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
  const supabase = createServerSupabaseClient() as unknown as SupabaseWriteClient;

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
      message: "No se pudo guardar el cliente. Revisa Supabase o las variables de entorno.",
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
      message: "El cliente se guardó, pero no se pudo crear la membresía.",
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
