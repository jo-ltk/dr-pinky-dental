"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HeroVisual — interactive implant showcase.
 *
 * Animations:
 *  • Entrance: scale-up + fade in on mount
 *  • Idle: gentle vertical float (CSS keyframe)
 *  • Mouse parallax: the implant tilts 3D toward the cursor
 *  • Cursor glow: a radial gold spotlight follows the mouse inside the card
 *  • Hover lift: slight upward translate + stronger drop-shadow
 *  • Reduced-motion: all animations disabled cleanly
 */
export function HeroVisual({
  className = "",
  poster = "/renders/implant-hero.png",
}: {
  className?: string;
  poster?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const [entered, setEntered] = useState(false);
  const [reduce, setReduce] = useState(false);

  // Detect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Entrance animation trigger (slight delay so page paints first)
  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(id);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;  // 0–1
    const cy = (e.clientY - rect.top) / rect.height;  // 0–1
    // Tilt: ±12 deg
    setTilt({ rx: (cy - 0.5) * -24, ry: (cx - 0.5) * 24 });
    // Glow follows cursor
    setGlow({ x: cx * 100, y: cy * 100, opacity: 1 });
  };

  const handleMouseLeave = () => {
    // Smooth spring back
    setTilt({ rx: 0, ry: 0 });
    setGlow(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`select-none ${className}`}
      style={{ perspective: "900px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3-D tilt wrapper */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: reduce
            ? "none"
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.18s cubic-bezier(0.2,0.7,0.2,1)",
          willChange: "transform",
        }}
        className="relative h-full w-full"
      >
        {/* Ambient purple glow behind */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(81,20,95,0.55), transparent 75%)",
          }}
        />

        {/* Ground shadow */}
        <div
          className="pointer-events-none absolute bottom-[2%] left-1/2 -translate-x-1/2 rounded-[50%]"
          style={{
            width: "46%",
            height: "5%",
            background: "rgba(18,2,23,0.7)",
            filter: "blur(14px)",
          }}
        />

        {/* Cursor spotlight (moves with mouse) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: `radial-gradient(circle 180px at ${glow.x}% ${glow.y}%, rgba(212,175,106,0.22), transparent 70%)`,
            opacity: glow.opacity,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* The implant PNG */}
        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{
            // Entrance: scale + fade
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.88)",
            transition: reduce
              ? "none"
              : "opacity 0.9s cubic-bezier(0.2,0.7,0.2,1), transform 1s cubic-bezier(0.2,0.7,0.2,1)",
          }}
        >
          <img
            src={poster}
            alt="Dental Implant"
            draggable={false}
            fetchPriority="high"
            className="max-h-full w-auto max-w-full object-contain"
            style={{
              // float-y is defined in globals.css
              animation: reduce ? "none" : "floatY 7s ease-in-out infinite",
              filter:
                "drop-shadow(0 28px 48px rgba(212,175,106,0.35)) drop-shadow(0 6px 18px rgba(18,2,23,0.6))",
              willChange: "transform",
            }}
          />
        </div>

        {/* Subtle rim highlight edge */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(212,175,106,0.12)",
          }}
        />
      </div>
    </div>
  );
}
