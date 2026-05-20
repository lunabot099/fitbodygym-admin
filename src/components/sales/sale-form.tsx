"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerSale } from "@/app/(dashboard)/ventas/actions";
import type { Product } from "@/lib/sales-data";

function Button() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:bg-neutral-400">{pending ? "Registrando..." : "Registrar venta"}</button>;
}

export function SaleForm({ products }: { products: Product[] }) {
  const [state, action] = useActionState(registerSale, { ok: false, message: "" });
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === productId);
  const total = useMemo(() => (product ? Number(product.price) * quantity : 0), [product, quantity]);

  return (
    <form action={action} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-bold">Registrar venta</h2>
      <div className="mt-5 space-y-4">
        <select name="product_id" value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
          {products.map((product) => <option key={product.id} value={product.id}>{product.name} · ${Number(product.price).toFixed(2)} · stock {product.stock}</option>)}
        </select>
        <input name="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10" />
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Total</p>
          <p className="mt-1 text-2xl font-bold">${total.toFixed(2)}</p>
        </div>
      </div>
      {state.message ? <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
      <Button />
    </form>
  );
}
