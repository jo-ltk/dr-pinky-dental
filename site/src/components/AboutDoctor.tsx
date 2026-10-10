import { ArrowUpRight, Award, CheckCircle2, HeartHandshake, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { clinic, doctorProfile } from "@/lib/clinic.config";
import { LogoMark } from "./Logo";

const WHATSAPP_CONSULTATION_URL =
  "https://wa.me/919562980890?text=" +
  encodeURIComponent(
    "Hello Dr. Pinky Varghese, I would like to enquire about a dental consultation for smile design / dental treatment. Please let me know your available appointment slots in Ernakulam / Aluva / Kakkanad / Angamaly. Thank you."
  );

export function AboutDoctor() {
  return (
    <section
      id="doctor"
      className="grain relative isolate overflow-hidden border-y border-line bg-gradient-to-b from-bg via-bg-2 to-bg py-20 sm:py-28 lg:py-36"
      aria-labelledby="about-doctor-heading"
    >
      {/* Background ambient lighting: primary purple #3B1048, deep plum #26082F, royal purple #51145F */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(81,20,95,0.45)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.12)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="wrap">
        {/* Editorial 2-column layout on desktop; prominent doctor portrait first on mobile */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* ── Column 1: Doctor Portrait ── */}
          <div className="lg:col-span-5" data-reveal>
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              {/* Subtle royal purple glow halo behind portrait frame */}
              <div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-royal/50 via-surface/60 to-transparent blur-2xl opacity-80"
                aria-hidden
              />

              {/* Framed card container with restrained gold decorative details */}
              <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-gradient-to-b from-surface/90 via-royal/40 to-bg/95 p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(26,5,34,0.9)] backdrop-blur-xl">
                {/* Restrained gold corner accents */}
                <span
                  className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-gold/70"
                  aria-hidden
                />

                {/* Top branding badge with original gold logo */}
                <div className="relative z-20 mb-2 flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2 rounded-full border border-line bg-bg/80 px-3 py-1 backdrop-blur-md">
                    <LogoMark className="h-6 w-auto" />
                    <span className="text-[11px] font-semibold tracking-wider text-gold-champagne uppercase">
                      Prosthodontics
                    </span>
                  </div>

                  <span className="rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-champagne">
                    MDS Specialist
                  </span>
                </div>

                {/* Portrait presentation: 100% uncropped face, preserved proportions (2:3 aspect ratio) */}
                <div className="relative mt-2 flex items-end justify-center">
                  {/* Subtle purple radial glow spotlight right behind Dr. Pinky */}
                  <div
                    className="absolute inset-x-4 bottom-8 top-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(81,20,95,0.85)_0%,rgba(59,16,72,0.45)_50%,transparent_75%)] blur-xl"
                    aria-hidden
                  />

                  <img
                    src="/dr-pinky.png"
                    alt="Portrait of Dr. Pinky Varghese, MDS — Consultant Implantologist & Smile Designer"
                    width={1024}
                    height={1536}
                    className="relative z-10 max-h-[460px] w-auto sm:max-h-[520px] lg:max-h-[560px] object-contain object-bottom filter drop-shadow-[0_20px_35px_rgba(20,3,28,0.75)] select-none transition-transform duration-700 ease-out hover:scale-[1.02]"
                    loading="eager"
                  />

                  {/* Soft bottom vignette seamlessly blending with the frame */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-bg via-bg/50 to-transparent"
                    aria-hidden
                  />
                </div>

                {/* Nameplate ribbon at base of portrait */}
                <div className="relative z-20 mt-1 border-t border-line/80 bg-surface/85 px-4 py-3 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-medium tracking-tight2 text-cream">
                        Dr. Pinky Varghese
                      </p>
                      <p className="text-[11px] font-semibold tracking-wide text-gold-champagne uppercase">
                        MDS · Prosthodontics
                      </p>
                    </div>
                    <span className="text-[11px] text-muted">Kerala, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Column 2: Editorial Content ── */}
          <div className="lg:col-span-7" data-reveal style={{ ["--d" as string]: 1 }}>
            {/* Heading eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-royal/40 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles size={13} className="text-gold" aria-hidden />
              <p id="about-doctor-heading" className="label !text-gold-champagne">
                Meet Your Smile Designer
              </p>
            </div>

            {/* Doctor Name & Credentials */}
            <h2 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-light leading-[1.05] tracking-hero text-cream">
              Dr. Pinky Varghese,{" "}
              <span className="font-normal text-gold-champagne">MDS</span>
            </h2>

            {/* Subtitle & Specialization */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="text-[16px] sm:text-[18px] font-medium text-gold">
                Consultant Implantologist &amp; Smile Designer
              </p>
              <span className="hidden sm:inline text-gold/30">•</span>
              <span className="inline-flex items-center rounded-md border border-gold/30 bg-surface/70 px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-gold-champagne">
                Prosthodontics
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 max-w-[620px] text-[15px] sm:text-[16px] leading-[1.7] text-cream/90">
              Dedicated to helping patients achieve healthier smiles through personalized dental care,
              implant treatment, and smile design.
            </p>

            {/* Specialized Clinical Focus Pillars */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface/40 p-3.5 backdrop-blur-sm transition-colors hover:border-gold/40">
                <div className="flex items-center gap-2 text-gold">
                  <Award size={16} aria-hidden />
                  <span className="text-[13px] font-semibold text-cream">Prosthodontics</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-muted">
                  Advanced MDS specialist expertise in full reconstruction and tooth replacement.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface/40 p-3.5 backdrop-blur-sm transition-colors hover:border-gold/40">
                <div className="flex items-center gap-2 text-gold">
                  <CheckCircle2 size={16} aria-hidden />
                  <span className="text-[13px] font-semibold text-cream">Implantology</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-muted">
                  Precision biocompatible titanium and ceramic root replacements.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface/40 p-3.5 backdrop-blur-sm transition-colors hover:border-gold/40">
                <div className="flex items-center gap-2 text-gold">
                  <HeartHandshake size={16} aria-hidden />
                  <span className="text-[13px] font-semibold text-cream">Smile Design</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-muted">
                  Architectural aesthetic sculpting customized to your facial harmony.
                </p>
              </div>
            </div>

            {/* Compact Location Row */}
            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-label text-gold-champagne">
                  Consultation Locations
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {doctorProfile.locations.map((loc) => (
                  <div
                    key={loc}
                    className="group flex items-center gap-2 rounded-lg border border-line bg-surface/50 px-3 py-2 text-[13px] font-medium text-cream backdrop-blur-sm transition-all hover:border-gold/40 hover:bg-surface/80"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-gold transition-transform group-hover:scale-125"
                      aria-hidden
                    />
                    <span>{loc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA: Gold-accented "Book a Consultation" button */}
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href={WHATSAPP_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto text-[15px] font-semibold"
                aria-label="Book a Consultation with Dr. Pinky Varghese on WhatsApp"
              >
                <MessageCircle size={18} aria-hidden />
                Book a Consultation
              </a>

              <a
                href="#locations"
                className="link-arrow min-h-[44px] text-[14px] text-gold-champagne"
              >
                View Clinic Centres <ArrowUpRight size={15} aria-hidden />
              </a>
            </div>

            <p className="mt-3 text-[12px] text-muted">
              Connects directly to WhatsApp (+91 95629 80890) · Enquire for appointment slots
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
