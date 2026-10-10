import { MapPin, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/clinic.config";
import { BookButton } from "./booking";

export function FinalCta() {
  return (
    <section className="grain relative isolate overflow-hidden py-28 sm:py-36 border-t border-line" aria-labelledby="final-title">
      {/* Smooth purple-to-plum gradient with subtle gold reflections */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_80%_at_70%_50%,#51145F_0%,#3B1048_45%,#26082F_100%)]" />
      <div className="ambient absolute right-[-10%] top-1/2 -z-10 h-[90%] w-[60%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.22),transparent)] blur-3xl" />

      {/* Decorative 3D visual silhouette */}
      <div className="pointer-events-none absolute right-[-6%] top-1/2 -z-10 h-[92%] -translate-y-1/2 rotate-[12deg] opacity-35 sm:right-[8%] sm:opacity-75" aria-hidden>
        <img src="/renders/implant-hero.png" alt="" loading="lazy" className="float-y h-full w-auto max-w-none drop-shadow-[0_20px_40px_rgba(212,175,106,0.3)]" />
      </div>

      <div className="wrap relative">
        <p className="label" data-reveal>Direct Consultation Booking</p>
        <h2
          id="final-title"
          className="mt-5 text-[clamp(42px,6.8vw,110px)] font-light leading-[0.96] tracking-hero text-cream"
          data-reveal
          style={{ ["--d" as string]: 1 }}
        >
          Your Smile Deserves<br />
          <span className="text-gold-champagne">Modern Care.</span>
        </h2>

        <p
          className="mt-6 max-w-[480px] text-[16px] leading-[1.65] text-cream/90"
          data-reveal
          style={{ ["--d" as string]: 2 }}
        >
          Schedule your consultation with <strong className="font-semibold text-gold-champagne">Dr. Pinky Varghese (MDS)</strong>. Personalized implantology, smile design, and restorative care across Ernakulam, Aluva, Kakkanad, and Angamaly.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-muted" data-reveal style={{ ["--d" as string]: 2.5 }}>
          <MapPin size={14} className="text-gold" />
          <span>Ernakulam · Aluva · Kakkanad · Angamaly</span>
        </div>

        <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4" data-reveal style={{ ["--d" as string]: 3 }}>
          <BookButton className="btn-primary w-full sm:w-auto text-[16px] px-8 py-4">
            <MessageCircle size={19} aria-hidden /> Schedule on WhatsApp (+91 95629 80890)
          </BookButton>
          <a
            href="https://wa.me/919562980890"
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow min-h-[44px] self-start sm:self-center py-2 text-[15px]"
          >
            Direct Chat · Instant Connect
          </a>
        </div>
      </div>
    </section>
  );
}
