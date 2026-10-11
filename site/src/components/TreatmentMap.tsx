"use client";

import { Activity, ChevronLeft, Clock, ShieldCheck, Smile, Sparkles, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import { LogoMark } from "./Logo";

/* ── Arch layout ─────────────────────────────────────────── */
const KINDS = ["M2", "M1", "P2", "P1", "C", "I2", "I1"] as const;
const SIZE: Record<(typeof KINDS)[number], number> = { M2: 17, M1: 18, P2: 13, P1: 13, C: 12, I2: 10.5, I1: 11.5 };
const NAME: Record<(typeof KINDS)[number], string> = { M2: "second molar", M1: "first molar", P2: "second premolar", P1: "first premolar", C: "canine", I2: "lateral incisor", I1: "central incisor" };

type Tooth = { id: string; x: number; y: number; r: number; label: string };

function buildArch(): Tooth[] {
  const cx = 160, cy = 190, rx = 106, ry = 155;
  const out: Tooth[] = [];
  (["upper", "lower"] as const).forEach((jaw) => {
    const seq = [...KINDS.map((k) => ["R", k] as const), ...[...KINDS].reverse().map((k) => ["L", k] as const)];
    const total = seq.reduce((s, [, k]) => s + SIZE[k], 0);
    const a0 = 0.2, a1 = Math.PI - 0.2;
    const N = 400, lens = [0];
    for (let i = 1; i <= N; i++) {
      const p = a0 + ((a1 - a0) * (i - 1)) / N, q = a0 + ((a1 - a0) * i) / N;
      lens.push(lens[i - 1] + Math.hypot(rx * (Math.cos(q) - Math.cos(p)), ry * (Math.sin(q) - Math.sin(p))));
    }
    const angleAt = (f: number) => {
      const target = f * lens[N];
      let i = lens.findIndex((l) => l >= target);
      if (i <= 0) i = 1;
      const w = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
      return a0 + ((a1 - a0) * (i - 1 + w)) / N;
    };
    let acc = 0;
    seq.forEach(([side, k]) => {
      const t = (acc + SIZE[k] / 2) / total;
      acc += SIZE[k];
      const a = angleAt(t);
      const x = cx - Math.cos(a) * rx;
      const y = jaw === "upper" ? cy - Math.sin(a) * ry : cy + Math.sin(a) * ry;
      out.push({ id: `${jaw}-${side}-${k}`, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, r: SIZE[k], label: `${jaw} ${side === "L" ? "left" : "right"} ${NAME[k]}` });
    });
  });
  return out;
}

function ImplantIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 4h10a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" />
      <path d="M9 9h6" />
      <path d="M10 12h4" />
      <path d="M10.5 15h3" />
      <path d="M11 18h2" />
      <path d="M12 9v12" />
    </svg>
  );
}

type Cat = {
  id: string;
  name: string;
  short: string;
  teeth: string[];
  text: string;
  steps: [string, string][];
  icon: (cls: string) => React.ReactNode;
  archOffset: string;
};

const CATS: Cat[] = [
  {
    id: "implants",
    name: "Dental Implants",
    short: "Implants",
    teeth: ["upper-L-M1", "lower-R-P2", "lower-R-M1"],
    text: "Missing teeth are mapped against your bite so each implant is placed with prosthetic precision to support a natural-looking crown.",
    steps: [["Consultation & 3D scan", "Assessment"], ["Implant placement", "Procedure"], ["Crown restoration", "Restoration"]],
    icon: (cls) => <ImplantIcon className={cls} />,
    archOffset: "translate-y-2 sm:translate-y-2.5",
  },
  {
    id: "smile-design",
    name: "Smile Design",
    short: "Smile",
    teeth: ["upper-L-I1", "upper-L-I2", "upper-L-C", "upper-R-I1", "upper-R-I2", "upper-R-C"],
    text: "Facial midline, lip curves, and tooth contours are analyzed to create a digitally previewed custom smile transformation.",
    steps: [["Aesthetic evaluation", "Design"], ["Diagnostic mockup", "Preview"], ["Veneer/Laminate bonding", "Completion"]],
    icon: (cls) => <Smile className={cls} />,
    archOffset: "translate-y-0.5 sm:translate-y-1",
  },
  {
    id: "root-canal",
    name: "Root Canal Treatment",
    short: "Root Canal",
    teeth: ["upper-R-M2", "lower-L-M1"],
    text: "Painful or damaged teeth are examined with microscopic precision; treatment focuses on saving the natural tooth root.",
    steps: [["Pain relief & scan", "Assessment"], ["Rotary canal therapy", "Procedure"], ["Crown protection", "Restoration"]],
    icon: (cls) => <Activity className={cls} />,
    archOffset: "-translate-y-1 sm:-translate-y-1.5",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    short: "Whitening",
    teeth: ["upper-L-I1", "upper-L-I2", "upper-L-C", "upper-R-I1", "upper-R-I2", "upper-R-C", "lower-L-I1", "lower-L-I2", "lower-R-I1", "lower-R-I2"],
    text: "Your visible smile zone is assessed for shade and sensitivity before a supervised laser/enamel-safe whitening protocol is applied.",
    steps: [["Shade assessment", "Assessment"], ["Whitening session", "Procedure"], ["Aftercare guidance", "Follow-up"]],
    icon: (cls) => <Sun className={cls} />,
    archOffset: "translate-y-0.5 sm:translate-y-1",
  },
  {
    id: "general",
    name: "General Dental Care",
    short: "General",
    teeth: [],
    text: "Routine dental wellness check-ups, ultrasonic scaling, and preventive care keeping all 32 teeth healthy and clean.",
    steps: [["Comprehensive check-up", "Assessment"], ["Deep ultrasonic scaling", "Preventive"], ["Wellness review", "Follow-up"]],
    icon: (cls) => <ShieldCheck className={cls} />,
    archOffset: "translate-y-2 sm:translate-y-2.5",
  },
];

export function TreatmentMap() {
  const arch = useMemo(buildArch, []);
  const [sel, setSel] = useState(CATS[0].id);
  const cat = CATS.find((c) => c.id === sel)!;
  const active = new Set(cat.teeth.length ? cat.teeth : arch.map((t) => t.id));
  const count = cat.teeth.length || arch.length;

  return (
    <section
      id="treatments"
      className="relative overflow-x-clip border-t border-line py-24 sm:py-32"
      aria-labelledby="map-title"
    >
      <style>{`
        @keyframes tm-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes tm-pop  { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes tm-breathe {
          0%, 100% {
            box-shadow: 0 0 16px rgba(212, 175, 106, 0.45), 0 8px 18px rgba(0, 0, 0, 0.6);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 28px rgba(212, 175, 106, 0.8), 0 10px 22px rgba(0, 0, 0, 0.7);
            transform: scale(1.04);
          }
        }
        .tm-rise { animation: tm-rise .45s ease both; }
        .tm-pop  { animation: tm-pop .5s ease both; }
        .tm-breathe { animation: tm-breathe 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tm-rise, .tm-pop, .tm-breathe { animation: none; }
        }
      `}</style>

      <div className="ambient pointer-events-none absolute -left-[15%] top-[10%] -z-10 h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.15),transparent)] blur-2xl" />

      <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
        {/* 1 · Section Heading */}
        <div className="lg:col-span-5 lg:row-start-1" data-reveal>
          <p className="label">Personalized Treatment Architecture</p>
          <h2 id="map-title" className="mt-4 text-[clamp(36px,5vw,72px)] font-light leading-[0.96] tracking-hero text-cream">
            A treatment plan<br /><span className="text-gold-champagne">mapped to you.</span>
          </h2>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-muted">
            Touch any procedure button below the interactive screen to observe how your bite, tooth positions, and clinical plan are customized.
          </p>
        </div>

        {/* 2 · Interactive Diagram (Square Architectural Frame + Gold Corner Brackets) */}
        <div
          className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 flex flex-col items-center w-full"
          data-reveal
          style={{ ["--d" as string]: 1 }}
        >
          {/* Architectural Screen Frame with 1px hairlines & square corners */}
          <div className="relative -mx-5 w-[calc(100%+2.5rem)] sm:mx-0 sm:w-full sm:max-w-[460px] border-y border-line bg-surface/90 sm:border sm:border-line p-4 sm:p-6 shadow-[0_0_40px_rgba(81,20,95,0.35)]">

            <div className="relative overflow-hidden border border-line/60 bg-[radial-gradient(120%_80%_at_50%_0%,#51145F_0%,#3B1048_45%,#26082F_100%)] px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
              
              {/* Top Bar inside Screen */}
              <div className="flex items-center justify-between" aria-hidden>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center border border-line bg-white/5 text-cream">
                    <ChevronLeft size={16} />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.18em] text-gold-champagne uppercase">
                    3D Bite Architecture
                  </span>
                </div>
                <div className="relative flex items-center gap-2 border border-line bg-black/50 px-2.5 py-1 text-white">
                  <LogoMark className="h-4 w-auto" />
                  <span className="h-1.5 w-1.5 bg-gold shadow-[0_0_6px_#D4AF6A]" />
                </div>
              </div>

              <p className="mt-4 text-[20px] font-light leading-[1.05] tracking-tight2 text-cream sm:text-[24px]">
                Treatment Plan <span className="text-gold-champagne">Overview</span>
              </p>

              {/* The Dental Arch Interactive SVG - Full scale & Centered */}
              <svg
                viewBox="0 0 320 380"
                className="mx-auto my-2 w-full max-w-[300px] sm:max-w-[320px]"
                role="img"
                aria-label={`Dental arch illustration highlighting example areas for ${cat.name}`}
              >
                {arch.map((t) => {
                  const on = active.has(t.id);
                  const focus = on && cat.teeth.length > 0;
                  const dim = cat.teeth.length > 0 && !on;
                  return (
                    <g
                      key={t.id}
                      className="cursor-pointer"
                      style={{ opacity: dim ? 0.35 : 1, transition: "opacity .45s ease" }}
                      onClick={() => {
                        const c = CATS.find((c) => c.teeth.includes(t.id));
                        if (c) setSel(c.id);
                      }}
                    >
                      <title>{t.label}</title>

                      {/* Pulsing halo on selected teeth */}
                      {focus && (
                        <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke="#F5DDA5" strokeWidth={1.3}>
                          <animate attributeName="r" values={`${t.r};${t.r + 9}`} dur="1.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.75;0" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                      )}

                      <circle
                        cx={t.x}
                        cy={t.y}
                        r={t.r}
                        fill={focus ? "#D4AF6A" : "rgba(212,175,106,0.06)"}
                        stroke={focus ? "#F5DDA5" : on ? "rgba(245,221,165,0.75)" : "rgba(212,175,106,0.3)"}
                        strokeWidth={1.4}
                        style={{
                          transition: "fill .45s ease, stroke .45s ease",
                          filter: focus ? "drop-shadow(0 0 8px rgba(212,175,106,0.85))" : undefined,
                        }}
                      />
                      {focus && <circle cx={t.x} cy={t.y} r={t.r * 0.32} fill="#26082F" />}
                    </g>
                  );
                })}

                <text x="56" y="196" fill="rgba(245,221,165,0.6)" fontSize="11" textAnchor="middle">R</text>
                <text x="264" y="196" fill="rgba(245,221,165,0.6)" fontSize="11" textAnchor="middle">L</text>

                {/* Central count & indicator */}
                <g key={cat.id} className="tm-pop">
                  <text x="160" y="202" fill="#FFF5E6" fontSize="68" fontWeight="300" textAnchor="middle" style={{ letterSpacing: "-0.04em" }}>
                    {count}
                  </text>
                  <text x="160" y="228" fill="#D4AF6A" fontSize="18" fontWeight="400" textAnchor="middle">
                    teeth
                  </text>
                  <text x="160" y="248" fill="rgba(255,245,230,0.75)" fontSize="11" textAnchor="middle">
                    in example plan
                  </text>
                </g>
              </svg>

              {/* Status footer inside screen */}
              <div className="mt-1 flex items-center justify-between text-[12px] text-cream/85" aria-hidden>
                <span key={cat.id} className="tm-pop font-medium text-gold-champagne">{cat.name}</span>
                <span className="flex items-center gap-1.5 text-muted">
                  <Clock size={13} className="text-gold" /> {cat.steps.length} clinical stages
                </span>
              </div>
            </div>
          </div>

          {/* ── Round Button Arch Console (Square Outer Frame + Gold Corner Brackets) ── */}
          <div className="relative mt-5 w-full max-w-[460px] border border-line bg-surface/90 p-4 sm:p-5 shadow-[0_0_30px_rgba(81,20,95,0.3)]">

            {/* Curved Arch Guideline Motif */}
            <svg
              className="pointer-events-none absolute inset-x-3 top-[56px] h-10 w-[calc(100%-1.5rem)] overflow-visible"
              viewBox="0 0 320 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 24 30 Q 160 2 296 30"
                stroke="url(#archGlow)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.55"
              />
              <defs>
                <linearGradient id="archGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4AF6A" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#F5DDA5" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#D4AF6A" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Console Header Cue with Touch Indicator */}
            <div className="mb-3.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-gold-champagne">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#D4AF6A]" />
                </span>
                <span>Touch to switch treatment</span>
              </div>
              <span className="border border-line bg-gold/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-gold-champagne">
                5 Procedures
              </span>
            </div>

            {/* 5 Round Tactile Buttons placed along the Arch Curve */}
            <div
              role="group"
              aria-label="Example treatment categories"
              className="relative z-10 grid grid-cols-5 gap-1 sm:gap-2.5 items-end"
            >
              {CATS.map((c) => {
                const isSel = sel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={isSel}
                    onClick={() => setSel(c.id)}
                    className={`group flex flex-col items-center transition-transform duration-300 ${c.archOffset} focus:outline-none`}
                  >
                    {/* Round tactile push button */}
                    <span
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 active:scale-90 active:translate-y-1 ${
                        isSel
                          ? "border-2 border-gold bg-gradient-to-b from-gold/35 via-gold/15 to-[#3B1048] text-gold-champagne tm-breathe ring-2 ring-gold/40 ring-offset-2 ring-offset-[#26082F]"
                          : "border border-line bg-gradient-to-b from-[#3B1048]/80 to-[#1e0524] text-cream/70 shadow-[0_6px_14px_rgba(0,0,0,0.5)] hover:border-gold/50 hover:text-cream"
                      }`}
                    >
                      {/* Gentle ping affordance */}
                      {isSel && (
                        <span
                          className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-gold/30 opacity-40"
                          aria-hidden="true"
                        />
                      )}
                      {c.icon("h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110")}
                    </span>

                    {/* Button label */}
                    <span
                      className={`mt-2 text-[10.5px] sm:text-[11.5px] font-medium leading-tight text-center tracking-tight transition-colors ${
                        isSel
                          ? "font-semibold text-gold-champagne drop-shadow-[0_1px_4px_rgba(212,175,106,0.4)]"
                          : "text-muted group-hover:text-cream"
                      }`}
                    >
                      {c.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 · Treatment Details Card (Square Corners & 1px Hairlines per SKILL.md) */}
        <div className="lg:col-span-5 lg:row-start-2" data-reveal>
          <div
            key={cat.id}
            className="tm-rise relative border border-line bg-surface/90 p-6 sm:p-8 transition-colors duration-500 hover:bg-royal/40"
            aria-live="polite"
          >

            <div className="flex items-center justify-between gap-3">
              <p className="text-[20px] font-normal leading-snug tracking-tight2 text-cream">{cat.name}</p>
              <span className="shrink-0 border border-line bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-champagne">
                {count} {count === 1 ? "area" : "areas"} mapped
              </span>
            </div>
            
            <p className="mt-3 text-[14px] leading-[1.65] text-muted">{cat.text}</p>

            {/* Clinical Roadmap Steps */}
            <div className="mt-6 border-t border-line/60 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-champagne">
                Clinical Workflow
              </p>
              <ol className="mt-3 space-y-2">
                {cat.steps.map(([title, tag], i) => (
                  <li
                    key={title}
                    className="flex items-center justify-between gap-3 border border-line bg-black/40 px-4 py-2.5 text-[12px]"
                  >
                    <span className="flex items-center gap-2.5 text-cream font-medium">
                      <span className="text-gold-champagne font-semibold text-[11px] tabular-nums tracking-wider">0{i + 1}</span>
                      {title}
                    </span>
                    <span
                      className={`border border-line/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        i === 0 ? "bg-gold/20 text-gold-champagne" : "bg-white/5 text-muted"
                      }`}
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-5 border-t border-line/40 pt-3 text-[11px] leading-relaxed text-muted/70">
              * Illustration only. Not a diagnosis. Specific clinical recommendations are provided following an in-person examination by Dr. Pinky Varghese.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}