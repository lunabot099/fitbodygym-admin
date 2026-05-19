export type ClientStatus = "active" | "inactive";
export type MembershipStatus = "active" | "expired" | "cancelled";

export type Client = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  document_id: string | null;
  status: ClientStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Membership = {
  id: string;
  client_id: string;
  plan_name: string;
  paid_at: string;
  expires_at: string;
  amount: number | null;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
};

export type ClientWithMembership = Client & {
  current_membership?: Membership | null;
};
