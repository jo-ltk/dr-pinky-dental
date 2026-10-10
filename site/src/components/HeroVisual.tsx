"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ToothScene = dynamic(() => import("./three/ToothScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The hero centerpiece. A pre-rendered image of the same 3D model shows first
 * (and stays if WebGL is unavailable); the live Three.js scene fades in over it
 * with cinematic subtle gold lighting.
 */
export function HeroVisual({
  variant = "implant",
  className = "",
  camZ = 10,
  poster = "/renders/implant.webp",
}: {
  variant?: "implant" | "tooth";
  className?: string;
  camZ?: number;
  poster?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);

    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowEnd = nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory < 2);
    const start = () => !lowEnd && hasWebGL() && setLive(true);
    const id = "requestIdleCallback" in window ? (window as any).requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 400);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (box.current) io.observe(box.current);

    return () => {
      mq.removeEventListener("change", on);
      io.disconnect();
      if ("cancelIdleCallback" in window) (window as any).cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} aria-hidden="true">
      {/* Warm champagne gold and royal purple volumetric ambient glow */}
      <div className="ambient pointer-events-none absolute left-1/2 top-[40%] h-[74%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.28),rgba(81,20,95,0.32)_55%,transparent)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-[3%] left-1/2 h-[6%] w-[36%] -translate-x-1/2 rounded-[50%] bg-[#120217]/85 blur-xl" />

      {/* Poster / static fallback render */}
      <div
        className={`absolute left-1/2 top-[48%] h-[88%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${
          ready ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <img
          src={poster}
          alt="Dental Implant 3D Model"
          width={475}
          height={1270}
          fetchPriority="high"
          className="float-y h-full w-auto max-w-none object-contain drop-shadow-[0_25px_50px_rgba(212,175,106,0.3)]"
          style={{ animationPlayState: reduce ? "paused" : undefined }}
        />
      </div>

      {live && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <ToothScene
            variant={variant}
            animate={!reduce}
            interactive={!reduce}
            paused={!visible}
            camZ={camZ}
            onFirstFrame={() => setReady(true)}
            onSlow={() => {
              setReady(false);
              setLive(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
