import { MapPin, MessageCircle, Phone } from "lucide-react";
import { clinic, treatments } from "@/lib/clinic.config";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-[#1c0423] pb-28 pt-16 sm:pb-12" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Clinic information</h2>
      <div className="wrap grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        {/* Doctor & Brand Info */}
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-wider text-gold-champagne">
            {clinic.title}
          </p>
          <p className="mt-2 text-[12px] font-medium text-cream/70">
            {clinic.qualification} ({clinic.specialization})
          </p>
          <p className="mt-4 max-w-[320px] text-[14px] leading-[1.65] text-muted">
            Specialized dental implants, digital smile designing, and aesthetic prosthodontic care across Kochi and greater Ernakulam district.
          </p>
          <div className="mt-5">
            <a
              href="https://wa.me/919562980890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-gold/40 bg-gold/10 px-4 py-2 text-[14px] font-medium text-gold-champagne transition-colors hover:border-gold hover:bg-gold/20"
            >
              <MessageCircle size={16} className="text-gold" />
              WhatsApp: +91 95629 80890
            </a>
          </div>
        </div>

        {/* Consultation Locations */}
        <div className="lg:col-span-3">
          <p className="label flex items-center gap-1.5">
            <MapPin size={13} className="text-gold" /> Consultation Centres
          </p>
          <ul className="mt-4 space-y-3 text-[14px] text-cream/85">
            {clinic.locations.map((loc) => (
              <li key={loc.id} className="border-b border-line/40 pb-2">
                <span className="font-medium text-gold-champagne">{loc.name}</span>
                <span className="block text-[12px] text-muted">{loc.area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dental Services */}
        <div className="lg:col-span-2">
          <p className="label">Treatments</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {treatments.map((t) => (
              <li key={t.id}>
                <a
                  href={whatsappUrl(enquiryMessage(t.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1 text-cream/80 transition-colors hover:text-gold-champagne"
                >
                  {t.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Hours */}
        <div className="lg:col-span-3">
          <p className="label">Contact & Hours</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-cream/85">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold" />
              <a href="tel:+919562980890" className="hover:text-gold-champagne transition-colors">
                {clinic.phoneDisplay}
              </a>
            </li>
            <li className="text-[13px] text-muted">
              Email: <span className="text-cream">{clinic.email}</span>
            </li>
          </ul>

          <p className="label mt-6">Consultation Hours</p>
          <ul className="mt-3 space-y-1 text-[13px] text-cream/80">
            {clinic.hours.map((h) => (
              <li key={h.days}>
                <span className="text-muted">{h.days}:</span> {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {clinic.fullName}. MDS (Prosthodontics). All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy/" className="inline-flex min-h-[44px] items-center hover:text-gold-champagne">
            Privacy Policy
          </a>
          <a href="#top" className="inline-flex min-h-[44px] items-center hover:text-gold-champagne">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
