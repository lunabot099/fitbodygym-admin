import Link from "next/link";

const features = [
  "Registro de clientes del gimnasio",
  "Control de pagos y vencimientos",
  "Validación de acceso premium para la app móvil",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            FitBodyGym Admin
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Panel administrativo para clientes y membresías.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            Este panel será usado por el equipo del gimnasio para registrar
            clientes, controlar pagos y mantener actualizada la información que
            desbloquea el acceso premium en la app móvil.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-lime-300"
          >
            Entrar al panel
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20"
            >
              <div className="mb-4 h-2 w-10 rounded-full bg-lime-400" />
              <h2 className="text-lg font-semibold">{feature}</h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
