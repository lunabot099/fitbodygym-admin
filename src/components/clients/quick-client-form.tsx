"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClientWithMembership } from "@/app/(dashboard)/clientes/actions";
import { addMonths, formatDateForElSalvador } from "@/lib/dates/format";

const durationOptions = [
  { label: "1 mes", months: 1 },
  { label: "2 meses", months: 2 },
  { label: "3 meses", months: 3 },
  { label: "4 meses", months: 4 },
  { label: "5 meses", months: 5 },
  { label: "6 meses", months: 6 },
  { label: "1 año", months: 12 },
];

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
      {pending ? "Guardando..." : "Guardar cliente"}
    </button>
  );
}

export function QuickClientForm() {
  const [state, formAction] = useActionState(createClientWithMembership, {
    ok: false,
    message: "",
  });
  const [startDate, setStartDate] = useState(todayISO());
  const [durationMonths, setDurationMonths] = useState(1);

  const expirationDate = useMemo(
    () => addMonths(startDate, durationMonths),
    [durationMonths, startDate],
  );

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-bold">Registro rápido</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Registra el cliente y define la duración de su membresía. El vencimiento
        se calcula automáticamente para evitar errores de digitación.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Nombre completo</span>
          <input name="full_name" required placeholder="Ej. Juan Pérez" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Correo</span>
          <input name="email" required type="email" placeholder="cliente@email.com" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Teléfono</span>
          <input name="phone" placeholder="+503 ..." className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Monto pagado</span>
          <input name="amount" type="number" min="0" step="0.01" placeholder="Ej. 30" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Fecha de inscripción</span>
            <input name="paid_at" required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
            <span className="mt-1 block text-xs text-neutral-500">{formatDateForElSalvador(startDate)}</span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Tiempo</span>
            <select name="duration_months" value={durationMonths} onChange={(event) => setDurationMonths(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
              {durationOptions.map((option) => <option key={option.months} value={option.months}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Fecha de vencimiento calculada</p>
          <p className="mt-2 text-2xl font-bold text-neutral-950">{formatDateForElSalvador(expirationDate)}</p>
          <p className="mt-1 text-xs text-neutral-600">Se guardará internamente como {expirationDate} para Supabase.</p>
        </div>
      </div>

      {state.message ? (
        <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
