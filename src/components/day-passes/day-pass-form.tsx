"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createDayPass } from "@/app/(dashboard)/visitas/actions";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? "Registrando..." : "Registrar visita"}
    </button>
  );
}

export function DayPassForm() {
  const [state, formAction] = useActionState(createDayPass, {
    ok: false,
    message: "",
  });

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-bold">Registrar visita</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Para personas que pagan solo la entrada del día. El precio queda en $2.00 por defecto.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Nombre del visitante</span>
          <input name="visitor_name" placeholder="Opcional" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Teléfono</span>
          <input name="phone" placeholder="Opcional" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Fecha</span>
            <input name="visit_date" type="date" defaultValue={todayISO()} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Monto</span>
            <input name="amount" type="number" min="0" step="0.01" defaultValue="2.00" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
          </label>
        </div>
      </div>

      {state.message ? (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          <p>{state.message}</p>
          {state.receiptId ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/comprobantes/${state.receiptId}`} className="rounded-lg bg-neutral-950 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800">
                Ver comprobante
              </Link>
              <Link href={`/comprobantes/${state.receiptId}`} target="_blank" className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-white">
                Abrir para imprimir
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
