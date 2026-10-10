"use client";

import { ArrowRight, MessageCircle, ShieldCheck, Users, Microscope } from "lucide-react";
import { BookButton } from "./booking";

const features = [
  { icon: ShieldCheck, title: "Expert Care" },
  { icon: Microscope, title: "Modern Technology" },
  { icon: Users, title: "Personalised Plans" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate flex flex-col items-center overflow-hidden px-5 pt-[calc(var(--header-h)+2rem)] pb-12 sm:px-8"
    >
      {/* Deep plum page background — matches site theme */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_50%_35%,#3B1048_0%,#2B0A35_55%,#26082F_100%)]" />

      {/* Ambient gold / purple glow drifting behind the implant */}
      <div className="ambient pointer-events-none absolute left-1/2 top-[22%] -z-10 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.16),transparent)] blur-3xl" />
      <div className="ambient pointer-events-none absolute left-[26%] top-[34%] -z-10 h-[46vh] w-[46vw] rounded-full bg-[radial-gradient(closest-side,rgba(150,60,170,0.35),transparent)] blur-3xl" style={{ animationDelay: "5s" }} />

      {/* ── Implant image — shown full, blends onto the plum background ── */}
      <div className="enter-fade relative z-0 flex w-full justify-center">
        <img
          src="/renders/implant-hero.png"
          alt="Dental implant crown illustration"
          draggable={false}
          fetchPriority="high"
          className="float-y w-[min(78vw,320px)] select-none sm:w-[min(58vw,360px)] lg:w-[min(36vw,400px)]"
          style={{
            mixBlendMode: "screen",
            filter: "drop-shadow(0 24px 60px rgba(212,175,106,0.35)) drop-shadow(0 10px 30px rgba(18,2,23,0.7))",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Specialist pill ── */}
      <div className="enter relative z-10 mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,106,0.35)] bg-[rgba(81,20,95,0.6)] px-4 py-1.5 backdrop-blur-sm" style={{ ["--d" as string]: "1" }}>
        <ShieldCheck size={13} className="text-gold" aria-hidden />
        <span className="text-[12px] font-semibold tracking-wide text-gold-champagne">
          Dr. Pinky Varghese · MDS Prosthodontics
        </span>
      </div>

      {/* ── Headline ── */}
      <h1
        className="enter relative z-10 mt-6 max-w-[16ch] text-center text-[clamp(40px,11vw,84px)] font-light leading-[1.03] text-cream sm:max-w-none"
        style={{ letterSpacing: "-0.025em", ["--d" as string]: "2" }}
      >
        A confident smile,<br />
        <span className="text-gold font-light italic">crafted with care.</span>
      </h1>

      {/* ── Sub-headline ── */}
      <p
        className="enter relative z-10 mt-6 max-w-[34ch] text-center text-[16px] leading-[1.6] text-muted sm:text-[18px]"
        style={{ ["--d" as string]: "3" }}
      >
        Advanced dental implants and personalised smile restoration.
      </p>

      {/* ── CTAs ── */}
      <div className="enter relative z-10 mt-8 flex w-full max-w-[520px] flex-col items-center gap-5" style={{ ["--d" as string]: "4" }}>
        <BookButton className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-[17px]">
          <MessageCircle size={19} aria-hidden />
          Book Appointment
          <ArrowRight size={18} aria-hidden className="ml-1" />
        </BookButton>
      </div>

      {/* ── Feature strip: 3 cards with dividers ── */}
      <div className="enter relative z-10 mt-12 w-full max-w-[760px] sm:mt-16" style={{ ["--d" as string]: "5" }}>
        <div className="grid grid-cols-3 divide-x divide-[rgba(212,175,106,0.18)]">
          {features.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-center gap-3 px-2 text-center sm:flex-row sm:justify-center sm:gap-4 sm:px-6">
              <Icon size={30} strokeWidth={1.4} className="text-gold" aria-hidden />
              <span className="text-[14px] font-medium leading-tight text-cream sm:text-[16px]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
