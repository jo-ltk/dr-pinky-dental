import { Award, CheckCircle2, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { clinic, doctorProfile } from "@/lib/clinic.config";
import { BookButton } from "./booking";

export function DoctorProfile() {
  return (
    <section id="doctor" className="relative border-t border-line bg-surface/40 py-24 sm:py-32" aria-labelledby="doctor-title">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Official Doctor Monogram & Emblem Presentation */}
          <div className="lg:col-span-5" data-reveal>
            <div className="relative mx-auto max-w-[420px] overflow-hidden border border-line bg-gradient-to-b from-royal/50 via-surface/80 to-bg p-8 sm:p-10 shadow-royal">
              {/* Gold decorative borders and accents */}
              <div className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold/60" />
              <div className="absolute right-3 top-3 h-4 w-4 border-r border-t border-gold/60" />
              <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-gold/60" />
              <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold/60" />

              <div className="flex flex-col items-center text-center">
                {/* Official Monogram */}
                <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-full border border-gold/40 bg-bg/80 p-4 shadow-gold">
                  <img
                    src="/logo.png"
                    alt={`${doctorProfile.name} Monogram`}
                    className="h-28 w-28 object-contain"
                  />
                </div>

                <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-champagne">
                  {doctorProfile.qualifications}
                </span>

                <h3 className="mt-4 text-[26px] font-light tracking-tight text-cream">
                  {doctorProfile.name}
                </h3>

                <p className="mt-1 text-[13px] font-medium tracking-wide text-gold">
                  {doctorProfile.role}
                </p>

                <p className="mt-4 text-[14px] leading-[1.6] text-muted">
                  {doctorProfile.experienceSummary}
                </p>

                {/* Consultation Locations Strip */}
                <div className="mt-6 w-full border-t border-line/60 pt-4 text-left">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-champagne">
                    <MapPin size={13} className="text-gold" /> Consultation Centres:
                  </p>
                  <p className="mt-1 text-[13px] text-cream/90">
                    {doctorProfile.locations.join(" · ")}
                  </p>
                </div>

                <div className="mt-6 w-full">
                  <BookButton
                    treatment="Consultation with Dr. Pinky Varghese"
                    className="btn-primary w-full text-[14px]"
                  >
                    <MessageCircle size={16} aria-hidden /> Direct Doctor Booking
                  </BookButton>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials, Specializations, and Philosophy */}
          <div className="lg:col-span-7" data-reveal style={{ ["--d" as string]: 1 }}>
            <p className="label">Doctor Profile & Expertise</p>
            <h2
              id="doctor-title"
              className="mt-4 text-[clamp(36px,4.5vw,68px)] font-light leading-[1] tracking-hero text-cream"
            >
              Specialist care backed by<br />
              <span className="text-gold-champagne">prosthodontic precision.</span>
            </h2>

            <p className="mt-6 text-[16px] leading-[1.7] text-cream/90">
              As a specialized Prosthodontist and Consultant Implantologist, <strong className="font-semibold text-gold-champagne">Dr. Pinky Varghese (MDS)</strong> focuses on the comprehensive rehabilitation of oral aesthetics and function. Whether restoring missing teeth with surgical implants or designing a harmonious smile, every treatment plan is tailored to the patient’s facial architecture and dental health.
            </p>

            {/* Core Competencies Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {doctorProfile.pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="border border-line bg-surface/70 p-5 transition-colors hover:border-gold/50 hover:bg-royal/40"
                >
                  <div className="flex items-center gap-2 text-gold">
                    <Sparkles size={16} />
                    <h4 className="text-[15px] font-medium text-cream">{pillar.title}</h4>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Consultation note */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-6">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-champagne">
                  Direct Phone & WhatsApp
                </p>
                <a
                  href="https://wa.me/919562980890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[18px] font-light text-cream hover:text-gold transition-colors font-mono"
                >
                  {clinic.phoneDisplay}
                </a>
              </div>

              <BookButton
                treatment="Consultation with Dr. Pinky Varghese"
                className="btn-ghost w-full sm:w-auto text-[14px]"
              >
                <MessageCircle size={16} /> Request Consultation Slot
              </BookButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
