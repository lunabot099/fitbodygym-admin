import { clients } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
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
                      <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-800">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{client.current_membership?.expires_at ?? "Sin membresía"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-bold">Registro rápido</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Esta primera versión deja listo el formulario visual. La conexión real se hará con Supabase.
          </p>
          <div className="mt-5 space-y-4">
            {[
              ["Nombre completo", "Ej. Juan Pérez"],
              ["Correo", "cliente@email.com"],
              ["Teléfono", "+503 ..."],
              ["Plan", "Mensual"],
              ["Fecha de vencimiento", "2026-06-19"],
            ].map(([label, placeholder]) => (
              <label key={label} className="block">
                <span className="text-sm font-medium text-neutral-700">{label}</span>
                <input
                  placeholder={placeholder}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10"
                />
              </label>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-lime-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-lime-400">
            Guardar cliente
          </button>
        </form>
      </section>
    </div>
  );
}
