"use client";

import { useEffect, useRef, useState } from "react";

type ScanResult = {
  name: string;
  status: "active" | "expired" | "pending";
  membership: string;
  expiresAt: string;
  confidence: number;
  message: string;
};

const demoResults: ScanResult[] = [
  {
    name: "Carlos Mendoza",
    status: "active",
    membership: "Plan mensual",
    expiresAt: "2026-06-18",
    confidence: 97,
    message: "Membresía activa. Acceso permitido.",
  },
  {
    name: "María López",
    status: "expired",
    membership: "Plan mensual",
    expiresAt: "2026-05-12",
    confidence: 94,
    message: "Membresía vencida. Acceso denegado.",
  },
  {
    name: "Cliente no confirmado",
    status: "pending",
    membership: "Pendiente de validación",
    expiresAt: "-",
    confidence: 72,
    message: "Reconocimiento bajo. Requiere revisión manual.",
  },
];

function getStatusStyles(status: ScanResult["status"]) {
  if (status === "active") {
    return {
      badge: "bg-green-100 text-green-700 ring-green-200",
      panel: "border-green-200 bg-green-50",
      button: "bg-green-600 text-white",
      title: "Acceso permitido",
    };
  }

  if (status === "expired") {
    return {
      badge: "bg-red-100 text-red-700 ring-red-200",
      panel: "border-red-200 bg-red-50",
      button: "bg-red-600 text-white",
      title: "Acceso denegado",
    };
  }

  return {
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
    panel: "border-amber-200 bg-amber-50",
    button: "bg-amber-500 text-white",
    title: "Revisión manual",
  };
}

export function FacialAccessDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "blocked">("idle");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("blocked");
      return;
    }

    try {
      setCameraState("loading");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState("ready");
    } catch {
      setCameraState("blocked");
    }
  }

  function runDemoScan() {
    setIsScanning(true);
    setResult(null);

    window.setTimeout(() => {
      const nextResult = demoResults[scanCount % demoResults.length];
      setResult(nextResult);
      setScanCount((current) => current + 1);
      setIsScanning(false);
    }, 1800);
  }

  const styles = result ? getStatusStyles(result.status) : null;

  return (
    <section className="mt-6 rounded-2xl bg-neutral-950 p-6 text-white shadow-sm ring-1 ring-black/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Prueba visual</p>
          <h2 className="mt-2 text-2xl font-bold">Reconocimiento facial y control de acceso</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-300">
            Demo para visualizar el flujo: cámara activa, reconocimiento del cliente, validación de membresía y respuesta de acceso.
            Esta prueba todavía no identifica rostros reales; simula el resultado para mostrar cómo se vería la experiencia.
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-neutral-200 ring-1 ring-white/10">
          Demo local / Supabase después
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div className="relative aspect-video">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

            {cameraState !== "ready" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl">📷</div>
                <p className="text-lg font-bold">Cámara de reconocimiento</p>
                <p className="mt-2 max-w-md text-sm text-neutral-400">
                  Activa la cámara para simular la pantalla que se usaría al registrar o validar el rostro del cliente.
                </p>
              </div>
            ) : null}

            {isScanning ? (
              <div className="absolute inset-0 border-4 border-red-500/80">
                <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-400 shadow-[0_0_60px_rgba(248,113,113,0.7)]" />
                <div className="absolute inset-x-8 top-1/2 h-1 animate-pulse rounded-full bg-red-400" />
                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-bold">
                  Escaneando rostro...
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 border-t border-white/10 bg-neutral-900 p-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={startCamera}
              disabled={cameraState === "loading" || cameraState === "ready"}
              className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300"
            >
              {cameraState === "loading" ? "Activando cámara..." : cameraState === "ready" ? "Cámara activa" : "Activar cámara"}
            </button>
            <button
              type="button"
              onClick={runDemoScan}
              disabled={cameraState !== "ready" || isScanning}
              className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300"
            >
              {isScanning ? "Validando..." : "Simular validación facial"}
            </button>
          </div>

          {cameraState === "blocked" ? (
            <div className="border-t border-red-500/20 bg-red-950/60 px-4 py-3 text-sm text-red-100">
              No se pudo activar la cámara. Revisa permisos del navegador o prueba desde HTTPS con una cámara conectada.
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl bg-white p-5 text-neutral-950">
          <h3 className="text-lg font-bold">Resultado de validación</h3>
          <p className="mt-1 text-sm text-neutral-500">Así se mostraría la decisión del sistema al reconocer a una persona.</p>

          {result && styles ? (
            <div className={`mt-5 rounded-2xl border p-5 ${styles.panel}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.badge}`}>{styles.title}</span>
                <span className="text-xs font-semibold text-neutral-500">Confianza {result.confidence}%</span>
              </div>
              <h4 className="mt-4 text-2xl font-black">{result.name}</h4>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="font-semibold text-neutral-500">Membresía</dt>
                  <dd className="mt-1 font-bold">{result.membership}</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="font-semibold text-neutral-500">Vencimiento</dt>
                  <dd className="mt-1 font-bold">{result.expiresAt}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm font-semibold">{result.message}</p>
              <div className={`mt-4 rounded-xl px-4 py-3 text-center text-sm font-black ${styles.button}`}>
                {result.status === "active" ? "ABRIR ACCESO" : result.status === "expired" ? "NO ABRIR" : "PEDIR AUTORIZACIÓN"}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
              Activa la cámara y ejecuta una validación para ver el resultado.
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-neutral-200 p-4">
            <h4 className="font-bold">Flujo real propuesto</h4>
            <ol className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>1. Cámara detecta rostro.</li>
              <li>2. Sistema identifica al cliente.</li>
              <li>3. Consulta membresía local/Supabase.</li>
              <li>4. Permite o bloquea acceso.</li>
              <li>5. Guarda el registro de entrada.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
