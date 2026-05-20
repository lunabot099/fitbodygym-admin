import { createServerSupabaseClient, hasSupabaseServerEnv } from "./supabase/server";

export type DayPass = {
  id: string;
  visitor_name: string | null;
  phone: string | null;
  visit_date: string;
  amount: number;
  receipt_id: string | null;
  created_at: string;
};

export async function getTodayDayPasses(): Promise<DayPass[]> {
  if (!hasSupabaseServerEnv()) return [];

  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("day_passes")
    .select("id, visitor_name, phone, visit_date, amount, receipt_id, created_at")
    .eq("visit_date", today)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading day passes", error);
    return [];
  }

  return (data ?? []) as DayPass[];
}
