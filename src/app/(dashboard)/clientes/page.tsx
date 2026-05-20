import { ClientsTable } from "@/components/clients/clients-table";
import { QuickClientForm } from "@/components/clients/quick-client-form";
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
        <ClientsTable clients={clients} />

        <QuickClientForm />
      </section>
    </div>
  );
}
