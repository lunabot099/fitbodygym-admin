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

        <div className="mt-12 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-6 text-sm leading-7 text-lime-50">
          Siguiente fase: conectar Supabase, crear autenticación para
          trabajadores y construir el módulo de clientes.
        </div>
      </section>
    </main>
  );
}
