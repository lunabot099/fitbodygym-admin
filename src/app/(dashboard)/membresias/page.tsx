import { formatDateForElSalvador } from "@/lib/dates/format";
import { getClients } from "@/lib/admin-data";

export default async function MembershipsPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
          Control de pagos
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Membresías</h1>
        <p className="mt-2 text-neutral-600">
          Pagos, vencimientos y estado de acceso premium para la app móvil.
        </p>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Vence</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {clients.map((client) => {
                const membership = client.current_membership;
                return (
                  <tr key={client.id}>
                    <td className="px-4 py-3 font-medium">{client.full_name}</td>
                    <td className="px-4 py-3">{membership?.plan_name ?? "-"}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDateForElSalvador(membership?.paid_at)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDateForElSalvador(membership?.expires_at)}
                    </td>
                    <td className="px-4 py-3">{membership?.amount ? `$${membership.amount}` : "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                        {membership?.status ?? "sin estado"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
