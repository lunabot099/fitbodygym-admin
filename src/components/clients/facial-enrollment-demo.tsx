"use client";

import { useEffect, useRef, useState } from "react";

export function FacialEnrollmentDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "blocked">("idle");
  const [scanState, setScanState] = useState<"empty" | "scanning" | "saved">("empty");

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

  function captureFace() {
    setScanState("scanning");

    window.setTimeout(() => {
      setScanState("saved");
    }, 1600);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Escaneo facial</p>
          <h3 className="mt-1 text-base font-bold text-neutral-950">Registro biométrico del cliente</h3>
          <p className="mt-1 text-xs leading-5 text-neutral-600">
            Al guardar el cliente, este rostro quedaría asociado a su perfil para validar acceso activo o vencido.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${scanState === "saved" ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"}`}>
          {scanState === "saved" ? "Rostro capturado" : "Pendiente"}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950">
        <div className="relative aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

          {cameraState !== "ready" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">📷</div>
              <p className="text-sm font-bold">Cámara para registrar rostro</p>
              <p className="mt-1 text-xs text-neutral-400">Activa la cámara y captura el rostro antes de guardar el cliente.</p>
            </div>
          ) : null}

          {scanState === "scanning" ? (
            <div className="absolute inset-0 border-4 border-red-500/80">
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-400 shadow-[0_0_45px_rgba(248,113,113,0.7)]" />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">
                Capturando rostro...
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-2 border-t border-white/10 bg-neutral-900 p-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={startCamera}
            disabled={cameraState === "loading" || cameraState === "ready"}
            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300"
          >
            {cameraState === "loading" ? "Activando..." : cameraState === "ready" ? "Cámara activa" : "Activar cámara"}
          </button>
          <button
            type="button"
            onClick={captureFace}
            disabled={cameraState !== "ready" || scanState === "scanning"}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300"
          >
            {scanState === "scanning" ? "Escaneando..." : scanState === "saved" ? "Repetir captura" : "Capturar rostro"}
          </button>
        </div>
      </div>

      {cameraState === "blocked" ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          No se pudo activar la cámara. Revisa permisos del navegador o conecta una cámara compatible.
        </p>
      ) : null}

      {scanState === "saved" ? (
        <input type="hidden" name="face_scan_demo" value="captured" />
      ) : null}
    </div>
  );
}
