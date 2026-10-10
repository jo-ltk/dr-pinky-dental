"use client";

import { ChevronLeft, Clock, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { LogoMark } from "./Logo";

/* ── Arch layout ─────────────────────────────────────────── */
const KINDS = ["M2", "M1", "P2", "P1", "C", "I2", "I1"] as const; // back → front, one quadrant
const SIZE: Record<(typeof KINDS)[number], number> = { M2: 17, M1: 18, P2: 13, P1: 13, C: 12, I2: 10.5, I1: 11.5 };
const NAME: Record<(typeof KINDS)[number], string> = { M2: "second molar", M1: "first molar", P2: "second premolar", P1: "first premolar", C: "canine", I2: "lateral incisor", I1: "central incisor" };

type Tooth = { id: string; x: number; y: number; r: number; label: string };

function buildArch(): Tooth[] {
  const cx = 160, cy = 200, rx = 106, ry = 166;
  const out: Tooth[] = [];
  (["upper", "lower"] as const).forEach((jaw) => {
    // left back → front → right back
    const seq = [...KINDS.map((k) => ["R", k] as const), ...[...KINDS].reverse().map((k) => ["L", k] as const)];
    const total = seq.reduce((s, [, k]) => s + SIZE[k], 0);
    const a0 = 0.2, a1 = Math.PI - 0.2;
    // arc-length table so beads sit evenly along the ellipse
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
      const x = cx - Math.cos(a) * rx * (side === "R" ? 1 : 1);
      const y = jaw === "upper" ? cy - Math.sin(a) * ry : cy + Math.sin(a) * ry;
      out.push({ id: `${jaw}-${side}-${k}`, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, r: SIZE[k], label: `${jaw} ${side === "L" ? "left" : "right"} ${NAME[k]}` });
    });
  });
  return out;
}

type Cat = { id: string; name: string; teeth: string[]; text: string; steps: [string, string][] };
const CATS: Cat[] = [
  {
    id: "implants",
    name: "Dental Implants",
    teeth: ["upper-L-M1", "lower-R-P2", "lower-R-M1"],
    text: "Missing teeth are mapped against your bite so each implant is placed with prosthetic precision to support a natural-looking crown.",
    steps: [["Consultation & 3D scan", "Assessment"], ["Implant placement", "Procedure"], ["Crown restoration", "Restoration"]],
  },
  {
    id: "smile-design",
    name: "Smile Design",
    teeth: ["upper-L-I1", "upper-L-I2", "upper-L-C", "upper-R-I1", "upper-R-I2", "upper-R-C"],
    text: "Facial midline, lip curves, and tooth contours are analyzed to create a digitally previewed custom smile transformation.",
    steps: [["Aesthetic evaluation", "Design"], ["Diagnostic mockup", "Preview"], ["Veneer/Laminate bonding", "Completion"]],
  },
  {
    id: "root-canal",
    name: "Root Canal Treatment",
    teeth: ["upper-R-M2", "lower-L-M1"],
    text: "Painful or damaged teeth are examined with microscopic precision; treatment focuses on saving the natural tooth root.",
    steps: [["Pain relief & scan", "Assessment"], ["Rotary canal therapy", "Procedure"], ["Crown protection", "Restoration"]],
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    teeth: ["upper-L-I1", "upper-L-I2", "upper-L-C", "upper-R-I1", "upper-R-I2", "upper-R-C", "lower-L-I1", "lower-L-I2", "lower-R-I1", "lower-R-I2"],
    text: "Your visible smile zone is assessed for shade and sensitivity before a supervised laser/enamel-safe whitening protocol is applied.",
    steps: [["Shade assessment", "Assessment"], ["Whitening session", "Procedure"], ["Aftercare guidance", "Follow-up"]],
  },
  {
    id: "general",
    name: "General Dental Care",
    teeth: [],
    text: "Routine dental wellness check-ups, ultrasonic scaling, and preventive care keeping all 32 teeth healthy and clean.",
    steps: [["Comprehensive check-up", "Assessment"], ["Deep ultrasonic scaling", "Preventive"], ["Wellness review", "Follow-up"]],
  },
];

export function TreatmentMap() {
  const arch = useMemo(buildArch, []);
  const [sel, setSel] = useState(CATS[0].id);
  const cat = CATS.find((c) => c.id === sel)!;
  const active = new Set(cat.teeth.length ? cat.teeth : arch.map((t) => t.id));
  const count = cat.teeth.length || arch.length;

  return (
    <section id="treatments" className="relative overflow-hidden py-24 sm:py-32 border-t border-line" aria-labelledby="map-title">
      <div className="ambient pointer-events-none absolute -left-[15%] top-[10%] -z-10 h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.15),transparent)] blur-2xl" />
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* copy + controls */}
        <div className="lg:col-span-5" data-reveal>
          <p className="label">Personalized Treatment Architecture</p>
          <h2 id="map-title" className="mt-4 text-[clamp(36px,4.6vw,68px)] font-light leading-[1] tracking-hero text-cream">
            A treatment plan<br /><span className="text-gold-champagne">mapped to you.</span>
          </h2>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-muted">
            Every restoration begins with prosthodontic examination and bite analysis. Select a treatment below to view an example clinical overview.
          </p>

          {/* Treatment Category Selector - Horizontally scrollable on mobile, flex-wrap on desktop */}
          <div className="mt-8 relative">
            <div
              role="group"
              aria-label="Example treatment categories"
              className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-3 pt-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0 sm:pb-0"
            >
              {CATS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={sel === c.id}
                  onClick={() => setSel(c.id)}
                  className={`h-11 shrink-0 rounded-full border px-5 text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                    sel === c.id
                      ? "border-gold bg-gradient-to-r from-gold/25 via-gold/15 to-gold/10 text-gold-champagne shadow-[0_0_16px_rgba(212,175,106,0.3)] ring-1 ring-gold/40"
                      : "border-line bg-surface/60 text-cream/70 hover:border-gold/40 hover:bg-surface hover:text-cream"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full transition-colors ${sel === c.id ? "bg-gold shadow-[0_0_8px_#D4AF6A]" : "bg-gold/30"}`} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Treatment Detail Box */}
          <div className="mt-6 rounded-2xl border border-line-strong bg-glass-card/90 p-6 sm:p-7 backdrop-blur-xl shadow-royal" aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[20px] font-medium leading-snug text-cream">{cat.name}</p>
              <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold-champagne">
                {count} {count === 1 ? "area" : "areas"} mapped
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-[1.65] text-muted">{cat.text}</p>
            <a
              href={whatsappUrl(enquiryMessage(cat.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full sm:w-auto text-[14px] sm:text-[15px] flex items-center justify-center gap-2.5"
            >
              <span className="grid h-6 w-6 place-items-center rounded-sm bg-white text-[#26082F]">
                <MessageCircle size={15} aria-hidden />
              </span>
              Enquire about {cat.name} on WhatsApp
            </a>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70 border-t border-line/40 pt-3">
              * Illustration only. Not a diagnosis. Specific clinical recommendations are provided following an in-person examination by Dr. Pinky Varghese.
            </p>
          </div>
        </div>

        {/* phone UI preview with luxury purple and gold theme */}
        <div className="flex justify-center lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--d" as string]: 1 }}>
          <div className="relative w-full max-w-[400px] sm:rounded-[52px] sm:border sm:border-gold/30 sm:bg-[#1a0421] sm:p-3 sm:shadow-royal">
            <div className="relative overflow-hidden border border-line bg-[radial-gradient(120%_70%_at_100%_0%,#51145F_0%,#3B1048_45%,#26082F_100%)] px-5 pb-6 pt-5 sm:rounded-[42px] sm:border-0 sm:px-6 sm:pt-12">
              <div className="absolute left-1/2 top-3 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-black/80 sm:block" aria-hidden />
              <div className="flex items-center justify-between" aria-hidden>
                <span className="grid h-10 w-10 place-items-center bg-white/10 text-cream"><ChevronLeft size={18} /></span>
                <span className="relative grid h-10 w-10 place-items-center bg-white/10 text-white">
                  <LogoMark className="h-6 w-auto" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold ring-2 ring-[#26082F]" />
                </span>
              </div>
              <p className="mt-4 text-[26px] font-light leading-[1.05] tracking-tight2 text-cream">
                Treatment Plan<br /><span className="text-gold-champagne">Overview</span>
              </p>

              <svg viewBox="0 0 320 400" className="mx-auto mt-4 w-full max-w-[290px]" role="img" aria-label={`Dental arch illustration highlighting example areas for ${cat.name}`}>
                {arch.map((t) => {
                  const on = active.has(t.id);
                  const focus = on && cat.teeth.length > 0;
                  return (
                    <g
                      key={t.id}
                      className="cursor-pointer"
                      onClick={() => {
                        const c = CATS.find((c) => c.teeth.includes(t.id));
                        if (c) setSel(c.id);
                      }}
                    >
                      <title>{t.label}</title>
                      <circle
                        cx={t.x}
                        cy={t.y}
                        r={t.r}
                        fill={focus ? "#D4AF6A" : "rgba(212,175,106,0.06)"}
                        stroke={focus ? "#F5DDA5" : on ? "rgba(245,221,165,0.75)" : "rgba(212,175,106,0.3)"}
                        strokeWidth={1.4}
                        style={{
                          transition: "fill .45s ease, stroke .45s ease",
                          filter: focus ? "drop-shadow(0 0 8px rgba(212,175,106,0.8))" : undefined,
                        }}
                      />
                      {focus && <circle cx={t.x} cy={t.y} r={t.r * 0.32} fill="#26082F" />}
                    </g>
                  );
                })}
                <text x="58" y="206" fill="rgba(245,221,165,0.6)" fontSize="11" textAnchor="middle">R</text>
                <text x="262" y="206" fill="rgba(245,221,165,0.6)" fontSize="11" textAnchor="middle">L</text>
                <text x="160" y="212" fill="#FFF5E6" fontSize="72" fontWeight="300" textAnchor="middle" style={{ letterSpacing: "-0.04em" }}>{count}</text>
                <text x="160" y="242" fill="#D4AF6A" fontSize="20" fontWeight="400" textAnchor="middle">teeth</text>
                <text x="160" y="262" fill="rgba(255,245,230,0.75)" fontSize="11" textAnchor="middle">in example plan</text>
              </svg>

              <div className="mt-3 flex items-center justify-between text-[12px] text-cream/85" aria-hidden>
                <span className="font-medium text-gold-champagne">{cat.name}</span>
                <span className="flex items-center gap-1.5 text-muted"><Clock size={13} className="text-gold" /> {cat.steps.length} steps</span>
              </div>
              <ol className="mt-3 space-y-2" aria-label="Example plan steps">
                {cat.steps.map(([title, tag], i) => (
                  <li key={title} className="flex items-stretch gap-2.5">
                    <span className={`grid w-10 shrink-0 place-items-center text-[11px] font-semibold ${i === 0 ? "bg-gold text-[#26082F]" : "border border-line text-gold-champagne"}`}>0{i + 1}</span>
                    <span className="flex flex-1 items-center justify-between bg-black/60 px-3 py-2.5 border border-line/40">
                      <span className="text-[12px] font-medium text-cream">{title}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium ${i === 0 ? "bg-gold/20 text-gold-champagne" : "bg-white/10 text-muted"}`}>{tag}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
