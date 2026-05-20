"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { renewMembership } from "@/app/(dashboard)/clientes/renew-actions";
import type { ClientWithMembership } from "@/lib/types";

const options = [
  { label: "1 mes", months: 1 },
  { label: "2 meses", months: 2 },
  { label: "3 meses", months: 3 },
  { label: "6 meses", months: 6 },
  { label: "1 año", months: 12 },
];

function Button() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:bg-neutral-400">{pending ? "..." : "Renovar"}</button>;
}

export function RenewMembershipForm({ client }: { client: ClientWithMembership }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(renewMembership, { ok: false, message: "" });

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50">Renovar</button>;
  }

  return (
    <div className="min-w-64 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <form action={action} className="space-y-3">
        <input type="hidden" name="client_id" value={client.id} />
        <p className="text-xs font-semibold text-neutral-700">Renovar a {client.full_name}</p>
        <select name="duration_months" className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs">
          {options.map((option) => <option key={option.months} value={option.months}>{option.label}</option>)}
        </select>
        <input name="amount" type="number" min="0" step="0.01" placeholder="Monto pagado" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs" />
        <div className="flex gap-2">
          <Button />
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-neutral-600 hover:bg-white">Cancelar</button>
        </div>
      </form>
      {state.message ? (
        <div className={`mt-2 rounded-lg px-3 py-2 text-xs ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          <p>{state.message}</p>
          {state.receiptId ? <Link href={`/comprobantes/${state.receiptId}`} className="mt-1 inline-block font-bold underline">Ver comprobante</Link> : null}
        </div>
      ) : null}
    </div>
  );
}
