export const dynamic = "force-dynamic";

import Link from "next/link";
import { DayPassForm } from "@/components/day-passes/day-pass-form";
import { formatDateForElSalvador } from "@/lib/dates/format";
import { getTodayDayPasses } from "@/lib/day-passes-data";

export default async function DayPassesPage() {
  const dayPasses = await getTodayDayPasses();
  const total = dayPasses.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
          Entradas diarias
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Visitas del día</h1>
        <p className="mt-2 text-neutral-600">
          Registro rápido para personas que pagan solo entrada diaria, sin crear membresía mensual.
        </p>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Visitas registradas hoy</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {dayPasses.length} visita{dayPasses.length === 1 ? "" : "s"} · Total ${total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Visitante</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {dayPasses.map((pass) => (
                  <tr key={pass.id}>
                    <td className="px-4 py-3 font-medium">{pass.visitor_name || "Visitante del día"}</td>
                    <td className="px-4 py-3 text-neutral-600">{pass.phone || "-"}</td>
                    <td className="px-4 py-3 text-neutral-600">{formatDateForElSalvador(pass.visit_date)}</td>
                    <td className="px-4 py-3 font-semibold">${Number(pass.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {pass.receipt_id ? (
                        <Link href={`/comprobantes/${pass.receipt_id}`} className="text-sm font-semibold text-red-600 hover:text-red-700">
                          Ver
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}

                {dayPasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                      Aún no hay visitas registradas hoy.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <DayPassForm />
      </section>
    </div>
  );
}
