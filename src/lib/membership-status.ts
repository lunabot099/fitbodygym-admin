import type { ClientWithMembership } from "./types";

export type MembershipUiStatus = {
  label: string;
  className: string;
};

export function getMembershipUiStatus(client: ClientWithMembership): MembershipUiStatus {
  const expiresAt = client.current_membership?.expires_at;

  if (client.status !== "active") {
    return {
      label: "Inactivo",
      className: "bg-neutral-100 text-neutral-700",
    };
  }

  if (!expiresAt) {
    return {
      label: "Sin membresía",
      className: "bg-neutral-100 text-neutral-700",
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (expiresAt < today) {
    return {
      label: "Vencido",
      className: "bg-red-100 text-red-700",
    };
  }

  if (expiresAt <= sevenDaysFromNow) {
    return {
      label: "Por vencer",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Activo",
    className: "bg-green-100 text-green-700",
  };
}
