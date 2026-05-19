import { clients as mockClients, dashboardStats as mockDashboardStats } from "./mock-data";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "./supabase/server";
import type { ClientWithMembership, Membership } from "./types";

export async function getClients(): Promise<ClientWithMembership[]> {
  if (!hasSupabaseServerEnv()) {
    return mockClients;
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select(
      `
      *,
      memberships (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading clients from Supabase", error);
    return mockClients;
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((client) => {
    const memberships = Array.isArray(client.memberships)
      ? (client.memberships as Membership[])
      : [];
    const currentMembership = memberships
      .sort((a, b) => b.expires_at.localeCompare(a.expires_at))
      .at(0);

    return {
      id: String(client.id),
      full_name: String(client.full_name),
      email: String(client.email),
      phone: client.phone ? String(client.phone) : null,
      document_id: client.document_id ? String(client.document_id) : null,
      status: client.status === "inactive" ? "inactive" : "active",
      notes: client.notes ? String(client.notes) : null,
      created_at: String(client.created_at),
      updated_at: String(client.updated_at),
      current_membership: currentMembership ?? null,
    };
  });
}

export async function getDashboardStats() {
  const clients = await getClients();
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (!hasSupabaseServerEnv()) {
    return mockDashboardStats;
  }

  const activeClients = clients.filter((client) => client.status === "active").length;
  const expiringSoon = clients.filter((client) => {
    const expiresAt = client.current_membership?.expires_at;
    return expiresAt && expiresAt >= today && expiresAt <= sevenDaysFromNow;
  }).length;
  const overdueMemberships = clients.filter((client) => {
    const expiresAt = client.current_membership?.expires_at;
    return expiresAt && expiresAt < today;
  }).length;
  const monthlyRevenue = clients.reduce(
    (total, client) => total + (client.current_membership?.amount ?? 0),
    0,
  );

  return {
    activeClients,
    expiringSoon,
    overdueMemberships,
    monthlyRevenue,
  };
}
