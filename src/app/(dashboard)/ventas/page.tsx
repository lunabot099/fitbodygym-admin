export const dynamic = "force-dynamic";

import { ProductForm } from "@/components/sales/product-form";
import { SaleForm } from "@/components/sales/sale-form";
import { getProducts, getTodaySales } from "@/lib/sales-data";

export default async function SalesPage() {
  const [products, sales] = await Promise.all([getProducts(), getTodaySales()]);
  const todayTotal = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Inventario y caja</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Ventas</h1>
        <p className="mt-2 text-neutral-600">Registra productos de la refri, ventas y control básico de stock.</p>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-bold">Productos</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Categoría</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Stock</th></tr></thead>
                <tbody className="divide-y divide-neutral-200">
                  {products.map((p) => <tr key={p.id}><td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3 text-neutral-600">{p.category}</td><td className="px-4 py-3">${Number(p.price).toFixed(2)}</td><td className={`px-4 py-3 font-semibold ${p.stock <= p.min_stock ? "text-red-600" : "text-neutral-900"}`}>{p.stock}</td></tr>)}
                  {products.length === 0 ? <tr><td colSpan={4} className="px-4 py-10 text-center text-neutral-500">Aún no hay productos.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-bold">Ventas de hoy</h2>
            <p className="mt-1 text-sm text-neutral-500">{sales.length} venta{sales.length === 1 ? "" : "s"} · Total ${todayTotal.toFixed(2)}</p>
            <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-4 py-3">Venta</th><th className="px-4 py-3">Hora</th><th className="px-4 py-3">Total</th></tr></thead>
                <tbody className="divide-y divide-neutral-200">
                  {sales.map((sale) => <tr key={sale.id}><td className="px-4 py-3 font-mono text-xs">{sale.sale_number}</td><td className="px-4 py-3 text-neutral-600">{new Date(sale.sold_at).toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit" })}</td><td className="px-4 py-3 font-bold">${Number(sale.total).toFixed(2)}</td></tr>)}
                  {sales.length === 0 ? <tr><td colSpan={3} className="px-4 py-10 text-center text-neutral-500">Aún no hay ventas hoy.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SaleForm products={products.filter((p) => p.active && p.stock > 0)} />
          <ProductForm />
        </div>
      </section>
    </div>
  );
}
