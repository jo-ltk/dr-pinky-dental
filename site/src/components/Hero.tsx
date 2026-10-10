"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { BookButton } from "./booking";

export function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 40, opacity: 0 });
  const [entered, setEntered] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    const id = setTimeout(() => setEntered(true), 60);
    return () => { mq.removeEventListener("change", onChange); clearTimeout(id); };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ rx: (cy - 0.5) * -12, ry: (cx - 0.5) * 12 });
    setGlow({ x: cx * 100, y: cy * 100, opacity: 1 });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlow(g => ({ ...g, opacity: 0 }));
  };

  return (
    <section
      id="top"
      className="grain relative isolate flex min-h-[100svh] items-center justify-center pt-[var(--header-h)]"
    >
      {/* Deep plum page background — matches site theme */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_40%,#3B1048_0%,#2B0A35_50%,#26082F_100%)]" />

      {/* Ambient gold glow drifting behind card */}
      <div className="ambient pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.13),transparent)] blur-3xl" />
      <div className="ambient pointer-events-none absolute left-[30%] top-[60%] -z-10 h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(81,20,95,0.4),transparent)] blur-3xl" style={{ animationDelay: "4s" }} />

      {/* ── Card ── */}
      <div
        className="relative mx-auto w-full sm:w-[min(70vw,420px)] lg:w-[min(36vw,440px)]"
        style={{ perspective: "1000px" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          ref={cardRef}
          className="relative overflow-hidden sm:rounded-3xl"
          style={{
            transformStyle: "preserve-3d",
            transform: reduce ? "none" : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            opacity: entered ? 1 : 0,
            scale: entered ? "1" : "0.92",
            transitionProperty: reduce ? "none" : "transform, opacity, scale",
            transitionDuration: "0.2s, 0.85s, 0.85s",
            transitionTimingFunction: "cubic-bezier(0.2,0.7,0.2,1)",
            willChange: "transform",
          }}
        >
          {/* Card background — site purple palette */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(175deg, #51145F 0%, #3B1048 40%, #26082F 100%)",
            }}
          />

          {/* Cursor gold spotlight */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `radial-gradient(circle 220px at ${glow.x}% ${glow.y}%, rgba(212,175,106,0.18), transparent 65%)`,
              opacity: glow.opacity,
              transition: "opacity 0.3s ease",
            }}
          />

          {/* ── Implant image — bleeds above card top ── */}
          <div
            className="relative flex justify-center overflow-visible"
            style={{ height: "clamp(240px, 42vh, 420px)" }}
          >
            <img
              src="/renders/implant-hero.png"
              alt="Dental Implant"
              draggable={false}
              fetchPriority="high"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto select-none object-contain"
              style={{
                height: "128%",
                maxWidth: "none",
                animation: reduce ? "none" : "floatY 7s ease-in-out infinite",
                filter:
                  "drop-shadow(0 24px 48px rgba(212,175,106,0.25)) drop-shadow(0 8px 20px rgba(18,2,23,0.7))",
                willChange: "transform",
              }}
            />

            {/* Fade image into text section */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(45,8,60,0.85) 65%, #2d083c 100%)",
              }}
            />
          </div>

          {/* ── Text + buttons ── */}
          <div
            className="relative z-10 px-7 pb-6 pt-3"
            style={{
              background:
                "linear-gradient(to bottom, #2d083c 0%, #26082F 100%)",
            }}
          >
            {/* Specialist pill */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,106,0.3)] bg-[rgba(81,20,95,0.6)] px-3 py-1 backdrop-blur-sm">
              <Sparkles size={11} className="text-gold" aria-hidden />
              <span className="text-[10px] font-semibold tracking-wide text-gold-champagne">
                Dr. Pinky Varghese · MDS Prosthodontics
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(36px,10vw,66px)] font-light leading-[1.05] text-cream"
              style={{ letterSpacing: "-0.02em" }}
            >
              Modern Care for a<br />
              <span className="text-gold font-light italic">Perfect</span>
              {" "}Smile.
            </h1>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3">
              {/* Primary — gold CTA */}
              <BookButton className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-[15px]">
                <MessageCircle size={17} aria-hidden />
                Book Appointment
              </BookButton>
            </div>
          </div>

          {/* Gold rim border */}
          <div
            className="pointer-events-none absolute inset-0 sm:rounded-3xl"
            style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,106,0.18)" }}
          />
        </div>

        {/* Card outer glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
          style={{
            boxShadow:
              "0 40px 100px -20px rgba(0,0,0,0.75), 0 0 70px -10px rgba(212,175,106,0.15)",
          }}
        />
      </div>
    </section>
  );
}
