import { QuickClientForm } from "@/components/clients/quick-client-form";
import { formatDateForElSalvador } from "@/lib/dates/format";
import { getClients } from "@/lib/admin-data";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
            Gestión del gimnasio
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="mt-2 text-neutral-600">
            Aquí se registrarán los clientes que luego podrán activar acceso premium en la app móvil.
          </p>
        </div>
        <button className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Nuevo cliente
        </button>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-bold">Listado</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Membresía</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-3 font-medium">{client.full_name}</td>
                    <td className="px-4 py-3 text-neutral-600">{client.email}</td>
                    <td className="px-4 py-3 text-neutral-600">{client.phone}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {client.current_membership?.expires_at
                        ? formatDateForElSalvador(client.current_membership.expires_at)
                        : "Sin membresía"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <QuickClientForm />
      </section>
    </div>
  );
}
