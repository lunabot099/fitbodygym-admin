"use client";

import { useMemo, useState } from "react";
import { formatDateForElSalvador } from "@/lib/dates/format";
import { getMembershipUiStatus } from "@/lib/membership-status";
import type { ClientWithMembership } from "@/lib/types";

type ClientsTableProps = {
  clients: ClientWithMembership[];
};

export function ClientsTable({ clients }: ClientsTableProps) {
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return clients;

    return clients.filter((client) => {
      const searchable = [client.full_name, client.email, client.phone ?? ""]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [clients, query]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Listado</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {filteredClients.length} de {clients.length} cliente{clients.length === 1 ? "" : "s"}
          </p>
        </div>
        <label className="block sm:w-80">
          <span className="sr-only">Buscar cliente</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, correo o teléfono"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
          />
        </label>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vence</th>
              <th className="px-4 py-3">Tiempo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredClients.map((client) => {
              const status = getMembershipUiStatus(client);

              return (
                <tr key={client.id}>
                  <td className="px-4 py-3 font-medium">{client.full_name}</td>
                  <td className="px-4 py-3 text-neutral-600">{client.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{client.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {client.current_membership?.expires_at
                      ? formatDateForElSalvador(client.current_membership.expires_at)
                      : "Sin membresía"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {client.current_membership?.plan_name ?? "-"}
                  </td>
                </tr>
              );
            })}

            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No encontramos clientes con esa búsqueda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
