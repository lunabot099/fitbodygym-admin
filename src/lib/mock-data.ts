import type { ClientWithMembership } from "./types";

export const dashboardStats = {
  activeClients: 128,
  expiringSoon: 14,
  overdueMemberships: 7,
  monthlyRevenue: 3840,
};

export const clients: ClientWithMembership[] = [
  {
    id: "demo-1",
    full_name: "María López",
    email: "maria.lopez@example.com",
    phone: "+503 7000 0001",
    document_id: null,
    status: "active",
    notes: "Plan mensual",
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-01T10:00:00Z",
    current_membership: {
      id: "membership-1",
      client_id: "demo-1",
      plan_name: "Mensual",
      paid_at: "2026-05-01",
      expires_at: "2026-06-01",
      amount: 30,
      status: "active",
      created_at: "2026-05-01T10:00:00Z",
      updated_at: "2026-05-01T10:00:00Z",
    },
  },
  {
    id: "demo-2",
    full_name: "Carlos Méndez",
    email: "carlos.mendez@example.com",
    phone: "+503 7000 0002",
    document_id: null,
    status: "active",
    notes: "Renovar esta semana",
    created_at: "2026-04-18T10:00:00Z",
    updated_at: "2026-05-18T10:00:00Z",
    current_membership: {
      id: "membership-2",
      client_id: "demo-2",
      plan_name: "Mensual",
      paid_at: "2026-04-18",
      expires_at: "2026-05-18",
      amount: 30,
      status: "expired",
      created_at: "2026-04-18T10:00:00Z",
      updated_at: "2026-05-18T10:00:00Z",
    },
  },
];
