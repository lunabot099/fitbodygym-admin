export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          document_id: string | null;
          status: "active" | "inactive";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          document_id?: string | null;
          status?: "active" | "inactive";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          phone?: string | null;
          document_id?: string | null;
          status?: "active" | "inactive";
          notes?: string | null;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          client_id: string;
          plan_name: string;
          paid_at: string;
          expires_at: string;
          amount: number | null;
          status: "active" | "expired" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          plan_name: string;
          paid_at: string;
          expires_at: string;
          amount?: number | null;
          status?: "active" | "expired" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          plan_name?: string;
          paid_at?: string;
          expires_at?: string;
          amount?: number | null;
          status?: "active" | "expired" | "cancelled";
          updated_at?: string;
        };
      };
      receipts: {
        Row: {
          id: string;
          receipt_number: string;
          client_id: string;
          membership_id: string | null;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          plan_name: string;
          paid_at: string;
          expires_at: string;
          amount: number | null;
          issued_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          receipt_number: string;
          client_id: string;
          membership_id?: string | null;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          plan_name: string;
          paid_at: string;
          expires_at: string;
          amount?: number | null;
          issued_at?: string;
          created_at?: string;
        };
        Update: {
          receipt_number?: string;
          client_id?: string;
          membership_id?: string | null;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          plan_name?: string;
          paid_at?: string;
          expires_at?: string;
          amount?: number | null;
          issued_at?: string;
        };
      };
    };
    Views: {
      active_memberships: {
        Row: {
          client_id: string;
          full_name: string;
          email: string;
          plan_name: string;
          paid_at: string;
          expires_at: string;
          membership_status: "active" | "expired" | "cancelled";
          client_status: "active" | "inactive";
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
