"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
    >
      Imprimir comprobante
    </button>
  );
}
