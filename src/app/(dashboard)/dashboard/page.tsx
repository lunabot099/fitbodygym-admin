import Link from "next/link";
import { getClients, getDashboardStats } from "@/lib/admin-data";

export default async function DashboardPage() {
  const [clients, dashboardStats] = await Promise.all([
    getClients(),
    getDashboardStats(),
  ]);

  const cards = [
    { label: "Clientes activos", value: dashboardStats.activeClients },
    { label: "Por vencer", value: dashboardStats.expiringSoon },
    { label: "Vencidas", value: dashboardStats.overdueMemberships },
    { label: "Ingresos del mes", value: `$${dashboardStats.monthlyRevenue}` },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
            Panel administrativo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Resumen</h1>
        </div>
        <Link
          href="/clientes"
          className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Registrar cliente
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Clientes recientes</h2>
          <Link href="/clientes" className="text-sm font-semibold text-lime-700 hover:text-lime-800">
            Ver todos
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Vence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-3 font-medium">{client.full_name}</td>
                  <td className="px-4 py-3 text-neutral-600">{client.email}</td>
                  <td className="px-4 py-3">{client.current_membership?.plan_name ?? "Sin plan"}</td>
                  <td className="px-4 py-3">{client.current_membership?.expires_at ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
