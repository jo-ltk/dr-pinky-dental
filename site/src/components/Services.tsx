import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { treatments } from "@/lib/clinic.config";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";

const visuals: Record<string, { src: string; cls: string }> = {
  implants: { src: "/renders/implant-hero.png", cls: "h-[116%] -bottom-[10%] rotate-[8deg]" },
  "smile-design": { src: "/renders/crown.webp", cls: "h-[76%] top-[12%] rotate-[5deg]" },
  cosmetic: { src: "/renders/aligner.webp", cls: "h-[84%] top-[8%] -scale-x-100 rotate-[-6deg]" },
  whitening: { src: "/renders/crown.webp", cls: "h-[74%] top-[13%]" },
  "root-canal": { src: "/renders/tooth.webp", cls: "h-[84%] top-[8%] -rotate-[6deg]" },
  general: { src: "/renders/tooth.webp", cls: "h-[84%] top-[8%] -scale-x-100 rotate-[5deg]" },
};

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="services-title">
      <div className="wrap">
        <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal>
            <p className="label">Specialized Dental Services</p>
            <h2
              id="services-title"
              className="mt-4 text-[clamp(36px,5vw,72px)] font-light leading-[1] tracking-hero text-cream"
            >
              Precision care for<br />
              <span className="text-gold-champagne">every stage of your smile.</span>
            </h2>
          </div>
          <p
            className="max-w-[420px] text-[15px] leading-[1.65] text-muted lg:col-span-5"
            data-reveal
            style={{ ["--d" as string]: 1 }}
          >
            Led by Prosthodontist Dr. Pinky Varghese (MDS), every procedure blends anatomical precision, biocompatible materials, and natural facial aesthetics.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t, i) => {
            const v = visuals[t.id] || { src: "/renders/crown.webp", cls: "h-[74%] top-[12%]" };
            return (
              <li key={t.id} className="group relative bg-surface/90">
                <article
                  data-reveal
                  style={{ ["--d" as string]: i % 3 }}
                  className="relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-500 hover:bg-royal/60 sm:p-8"
                >
                  {/* Subtle royal/gold ambient glow on hover */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/0 blur-3xl transition-colors duration-700 group-hover:bg-gold/15" />

                  <div className="relative flex items-start justify-between">
                    <span className="text-[12px] font-semibold tabular-nums text-gold-champagne tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-gold/40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-champagne"
                      aria-hidden
                    />
                  </div>

                  <div className="relative mx-auto my-4 h-44 w-full overflow-hidden sm:my-6 sm:h-52">
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
                    <img
                      src={v.src}
                      alt={t.name}
                      loading="lazy"
                      decoding="async"
                      className={`absolute left-1/2 w-auto max-w-none -translate-x-1/2 transition-transform duration-700 ease-out group-hover:-translate-y-2 ${v.cls}`}
                    />
                  </div>

                  <h3 className="relative text-[22px] font-normal tracking-tight2 text-cream">
                    {t.name}
                  </h3>
                  <p className="relative mt-2 text-[14px] leading-[1.6] text-muted">
                    {t.description}
                  </p>

                  {t.benefits && (
                    <ul className="relative mt-4 space-y-1.5 border-t border-line/60 pt-3 text-[12px] text-cream/80">
                      {t.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-gold shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="relative mt-6 pt-2">
                    <a
                      href={whatsappUrl(enquiryMessage(t.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow min-h-[44px] text-[14px] text-gold-champagne hover:text-cream"
                      aria-label={`Enquire about ${t.name} on WhatsApp`}
                    >
                      <MessageCircle size={16} className="text-gold" aria-hidden /> Enquire on WhatsApp
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
