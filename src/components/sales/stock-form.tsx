"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addProductStock } from "@/app/(dashboard)/ventas/actions";
import type { Product } from "@/lib/sales-data";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="mt-5 w-full rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:bg-neutral-400"
    >
      {pending ? "Agregando..." : "Agregar existencia"}
    </button>
  );
}

export function StockForm({ products }: { products: Product[] }) {
  const [state, action] = useActionState(addProductStock, { ok: false, message: "" });

  return (
    <form action={action} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-bold">Agregar existencia</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Usa esto cuando compren más producto. El sistema suma automáticamente al stock actual.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Producto</span>
          <select name="product_id" className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · stock actual {product.stock}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Cantidad a ingresar</span>
          <input name="quantity" required type="number" min="1" placeholder="Ej. 24" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Nota</span>
          <input name="notes" placeholder="Ej. Compra semanal" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        </label>
      </div>

      {state.message ? (
        <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <Button />
    </form>
  );
}
