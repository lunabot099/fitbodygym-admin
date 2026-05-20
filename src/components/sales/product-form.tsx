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
      <p className="mt-2 text-sm text-neutral-600">
        Crea productos de la refri. La alerta de compra queda en 5 por defecto.
      </p>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Nombre del producto</span>
          <input name="name" required placeholder="Ej. Gatorade" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Categoría</span>
          <input name="category" placeholder="Bebidas" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Precio de venta</span>
          <input name="price" required type="number" min="0" step="0.01" placeholder="Ej. 1.50" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Cantidad inicial</span>
            <input name="stock" type="number" min="0" placeholder="Ej. 24" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
            <span className="mt-1 block text-xs text-neutral-500">Unidades que hay actualmente.</span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Alerta de compra</span>
            <input name="min_stock" type="number" min="0" defaultValue="5" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
            <span className="mt-1 block text-xs text-neutral-500">Avisar cuando queden 5 o menos.</span>
          </label>
        </div>
      </div>
      {state.message ? <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
      <Button />
    </form>
  );
}
