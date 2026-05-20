import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/receipts/print-button";
import { formatDateForElSalvador } from "@/lib/dates/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Receipt = {
  id: string;
  receipt_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  plan_name: string;
  paid_at: string;
  expires_at: string;
  amount: number | null;
  issued_at: string;
};

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("receipts")
    .select("id, receipt_number, client_name, client_email, client_phone, plan_name, paid_at, expires_at, amount, issued_at")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const receipt = data as Receipt;

  return (
    <div className="mx-auto max-w-3xl py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/clientes" className="text-sm font-semibold text-red-600 hover:text-red-700">
          ← Volver a clientes
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0">
        <header className="flex items-start justify-between border-b border-neutral-200 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">FitBodyGym</p>
            <h1 className="mt-3 text-3xl font-bold">Comprobante de pago</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Número</p>
            <p className="font-mono text-lg font-bold">{receipt.receipt_number}</p>
          </div>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-500">Cliente</p>
            <p className="mt-1 text-lg font-semibold">{receipt.client_name}</p>
            <p className="text-neutral-600">{receipt.client_email}</p>
            <p className="text-neutral-600">{receipt.client_phone || "Sin teléfono"}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-neutral-500">Fecha de emisión</p>
            <p className="mt-1 font-semibold">{formatDateForElSalvador(receipt.issued_at)}</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3">Concepto</th>
                <th className="px-4 py-3">Inscripción</th>
                <th className="px-4 py-3">Vencimiento</th>
                <th className="px-4 py-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 font-medium">Membresía {receipt.plan_name}</td>
                <td className="px-4 py-4">{formatDateForElSalvador(receipt.paid_at)}</td>
                <td className="px-4 py-4">{formatDateForElSalvador(receipt.expires_at)}</td>
                <td className="px-4 py-4 text-right font-bold">
                  {receipt.amount !== null ? `$${receipt.amount.toFixed(2)}` : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="mt-8 text-center text-xs text-neutral-500">
          Este documento es un comprobante interno de pago de FitBodyGym.
        </footer>
      </article>
    </div>
  );
}
