"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProduct } from "@/app/(dashboard)/ventas/actions";

function Button() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="mt-5 w-full rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:bg-neutral-400">{pending ? "Guardando..." : "Agregar producto"}</button>;
}

export function ProductForm() {
  const [state, action] = useActionState(createProduct, { ok: false, message: "" });
  return (
    <form action={action} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-bold">Nuevo producto</h2>
      <div className="mt-5 space-y-4">
        <input name="name" required placeholder="Ej. Gatorade" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        <input name="category" placeholder="Categoría: Bebidas" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        <div className="grid grid-cols-3 gap-3">
          <input name="price" required type="number" min="0" step="0.01" placeholder="Precio" className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
          <input name="stock" type="number" min="0" placeholder="Stock" className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
          <input name="min_stock" type="number" min="0" placeholder="Mín." className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </div>
      </div>
      {state.message ? <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
      <Button />
    </form>
  );
}
