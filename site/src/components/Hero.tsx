"use client";

import { ArrowDownRight, ArrowRight, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { clinic, doctorProfile } from "@/lib/clinic.config";
import { BookButton } from "./booking";
import { HeroVisual } from "./HeroVisual";

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning className="tabular-nums font-mono text-gold-champagne">{t || "—"}</span>;
}

export function Hero() {
  return (
    <section id="top" className="grain relative isolate min-h-[100svh] overflow-hidden pt-[var(--header-h)]">
      {/* Cinematic luxury background: deep plum #26082F → primary purple #3B1048 → royal purple #51145F */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_60%_35%,#3B1048_0%,#2B0A35_45%,#26082F_100%)]" />
      <div className="ambient absolute -right-[12%] top-[-15%] -z-10 h-[70vh] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.16),transparent)] blur-3xl" />
      <div className="ambient absolute -left-[10%] bottom-[10%] -z-10 h-[50vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(81,20,95,0.35),transparent)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-bg to-transparent" />

      <div className="wrap relative grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 lg:grid-cols-12">
        {/* 3D Hero Piece: centre-right on desktop, top on mobile */}
        <HeroVisual className="order-1 -mx-5 h-[36svh] min-h-[260px] max-h-[420px] sm:h-[50svh] sm:max-h-none lg:absolute lg:inset-y-0 lg:left-[40%] lg:mx-0 lg:h-auto lg:w-[36%] lg:min-h-0" />

        {/* Left Column: editorial headline & doctor credentials */}
        <div className="relative z-10 order-2 flex flex-col justify-start pb-8 sm:justify-center lg:col-span-7 lg:order-none lg:pb-24 lg:pt-6">
          {/* Doctor Badge */}
          <div className="enter inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface/70 px-3.5 py-1.5 backdrop-blur-md" style={{ ["--d" as string]: 0 }}>
            <Sparkles size={13} className="text-gold" aria-hidden />
            <span className="text-[11px] font-semibold tracking-wide text-gold-champagne">
              Dr. Pinky Varghese · MDS (Prosthodontics)
            </span>
          </div>

          <h1 className="mt-3 text-[clamp(44px,7.2vw,118px)] font-light leading-[0.96] sm:mt-5 tracking-hero lg:mt-6 text-cream">
            <span className="enter block text-gold-champagne font-light" style={{ ["--d" as string]: 1 }}>
              Modern Care
            </span>
            <span className="enter block" style={{ ["--d" as string]: 2 }}>
              <span className="text-gold font-light">for a</span> Perfect
            </span>
            <span className="enter block" style={{ ["--d" as string]: 3 }}>
              Smile.
            </span>
          </h1>

          <p className="enter mt-3 text-[14px] font-medium tracking-wide text-gold sm:text-[15px]" style={{ ["--d" as string]: 4 }}>
            {clinic.title}
          </p>

          <p className="enter mt-3 max-w-[460px] text-[15px] leading-[1.6] text-muted sm:mt-4 sm:text-[16px]" style={{ ["--d" as string]: 5 }}>
            Advanced dental implants, architectural smile designing, and comprehensive prosthodontic restorations crafted with surgical precision and artistic care.
          </p>

          {/* Consultation centers badge */}
          <div className="enter mt-4 flex flex-wrap items-center gap-2 text-[12px] text-cream/90 sm:mt-5" style={{ ["--d" as string]: 6 }}>
            <span className="flex items-center gap-1 font-semibold text-gold-champagne">
              <MapPin size={13} className="text-gold" /> Consultation Centres:
            </span>
            <span className="text-muted">Ernakulam · Aluva · Kakkanad · Angamaly</span>
          </div>

          {/* Action CTAs */}
          <div className="enter mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5" style={{ ["--d" as string]: 7 }}>
            <BookButton className="btn-primary h-14 w-full text-[16px] sm:h-[52px] sm:w-auto sm:text-[15px]">
              <MessageCircle size={18} aria-hidden /> Book Your Appointment
            </BookButton>
            <a href="#services" className="link-arrow min-h-[44px] self-center py-2 text-[15px] sm:self-auto">
              Explore Treatments <ArrowRight size={16} aria-hidden />
            </a>
          </div>

          <p className="enter mt-5 text-center text-[12px] font-medium text-muted sm:mt-7 sm:text-left" style={{ ["--d" as string]: 8 }}>
            WhatsApp Direct: <a href="https://wa.me/919562980890" target="_blank" rel="noopener noreferrer" className="text-gold-champagne hover:underline font-semibold">+91 95629 80890</a> · Fast Reply
          </p>

          {/* Mobile Doctor Profile - visible only on mobile/tablet */}
          <a
            href="#doctor"
            className="enter group mt-6 flex items-center gap-4 border border-line bg-surface/40 p-3 backdrop-blur-sm transition-colors hover:border-gold lg:hidden"
            style={{ ["--d" as string]: 9 }}
          >
            <div className="relative h-[72px] w-[56px] shrink-0 overflow-hidden border border-line">
              <img
                src="/dr-pinky-photo.png"
                alt="Dr. Pinky Varghese"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-champagne">Specialist In Charge</p>
              <p className="text-[15px] font-light text-cream leading-snug">Dr. Pinky Varghese</p>
              <p className="text-[11px] font-semibold text-gold">MDS · Prosthodontics</p>
            </div>
            <ArrowDownRight size={18} className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden />
          </a>
        </div>

        {/* Right column: Doctor summary showcase */}
        <aside className="relative z-10 hidden flex-col justify-between border-l border-line pb-24 pl-8 pt-10 lg:col-span-3 lg:col-start-10 lg:flex">
          <div className="enter-fade space-y-3">
            <p className="label">Specialist In Charge</p>
            <p className="max-w-[240px] text-[18px] font-light leading-[1.35] text-cream">
              {doctorProfile.name}
            </p>
            <p className="text-[12px] font-semibold text-gold-champagne uppercase tracking-wider">
              {doctorProfile.qualifications}
            </p>
            <p className="text-[13px] leading-[1.6] text-muted">
              {doctorProfile.role}
            </p>
          </div>

          <a href="#doctor" className="enter-fade group block">
            <span className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-gold-champagne">
              Doctor Profile <ArrowDownRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 text-gold" aria-hidden />
            </span>
            <div className="relative aspect-[4/5] w-full max-w-[210px] overflow-hidden border border-line bg-gradient-to-b from-royal/60 to-bg transition-colors group-hover:border-gold">
              <img
                src="/dr-pinky-photo.png"
                alt="Dr. Pinky Varghese – Prosthodontist"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 border-t border-line/60 bg-bg/80 backdrop-blur-sm px-2 py-1.5 text-[11px] text-muted">
                4 Consultation Locations
              </div>
            </div>
          </a>
        </aside>
      </div>

      {/* Bottom Trust Strip */}
      <div className="relative z-10 border-t border-line bg-bg/60 backdrop-blur-sm">
        <div className="wrap grid grid-cols-2 gap-y-4 py-4 text-[12px] leading-[1.45] text-cream/90 sm:grid-cols-4">
          <div>
            <span className="font-semibold text-gold-champagne">Prosthodontics & Implants</span>
            <p className="text-muted">Specialist MDS Consultation</p>
          </div>
          <div>
            <span className="font-semibold text-gold-champagne">Ernakulam District</span>
            <p><LocalTime /></p>
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold text-gold-champagne">WhatsApp Booking</span>
            <p className="text-muted">+91 95629 80890</p>
          </div>
          <div className="hidden text-right sm:block">
            <span className="font-semibold text-gold-champagne">4 Centres Available</span>
            <p className="text-muted">Ernakulam · Aluva · Kakkanad · Angamaly</p>
          </div>
        </div>
      </div>
    </section>
  );
}
