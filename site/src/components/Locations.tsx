import { Clock, MapPin, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/clinic.config";
import { BookButton } from "./booking";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";

export function Locations() {
  return (
    <section id="locations" className="relative py-24 sm:py-32" aria-labelledby="locations-title">
      <div className="wrap">
        <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal>
            <p className="label">Consultation Locations</p>
            <h2
              id="locations-title"
              className="mt-4 text-[clamp(36px,5vw,72px)] font-light leading-[1] tracking-hero text-cream"
            >
              Consultations across<br />
              <span className="text-gold-champagne">four prime centers.</span>
            </h2>
          </div>
          <p
            className="max-w-[420px] text-[15px] leading-[1.65] text-muted lg:col-span-5"
            data-reveal
            style={{ ["--d" as string]: 1 }}
          >
            Dr. Pinky Varghese consults across key centers in Ernakulam, Aluva, Kakkanad, and Angamaly. Choose your preferred location for personalized implant and smile planning.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clinic.locations.map((loc, i) => (
            <div
              key={loc.id}
              data-reveal
              style={{ ["--d" as string]: i }}
              className="group relative flex flex-col justify-between border border-line bg-surface/80 p-6 transition-all duration-300 hover:border-gold/60 hover:bg-royal/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne">
                    <MapPin size={18} />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-champagne">
                    Location {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-[22px] font-normal tracking-tight text-cream group-hover:text-gold-champagne transition-colors">
                  {loc.name}
                </h3>
                <p className="mt-1 text-[12px] font-medium text-gold">
                  {loc.area}
                </p>

                <p className="mt-3 text-[13px] leading-[1.6] text-muted">
                  {loc.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 border-t border-line/60 pt-3 text-[12px] text-cream/90">
                  <Clock size={13} className="text-gold shrink-0" />
                  <span>{loc.timing}</span>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <BookButton
                  treatment={`Consultation at ${loc.name}`}
                  className="btn-ghost w-full !h-10 !text-[13px] hover:border-gold"
                >
                  <MessageCircle size={15} aria-hidden /> Book at {loc.name}
                </BookButton>
              </div>
            </div>
          ))}
        </div>

        {/* Note on coordination */}
        <div className="mt-10 border border-line bg-surface/40 p-5 text-center text-[13px] text-muted" data-reveal>
          Appointments are coordinated exclusively through WhatsApp at <strong className="font-semibold text-gold-champagne">+91 95629 80890</strong>. Special weekend and evening slots are scheduled upon prior request.
        </div>
      </div>
    </section>
  );
}
