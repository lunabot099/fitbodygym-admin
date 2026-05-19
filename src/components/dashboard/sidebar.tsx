import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/clientes", label: "Clientes" },
  { href: "/membresias", label: "Membresías" },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-neutral-950 px-6 py-8 text-white lg:block">
      <Link href="/dashboard" className="block">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          FitBodyGym
        </p>
        <h1 className="mt-3 text-2xl font-bold">Admin</h1>
      </Link>

      <nav className="mt-10 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
