"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { BookButton, useBooking } from "./booking";

/**
 * Desktop: floating WhatsApp button. Mobile: sticky bottom bar. Both appear after the hero.
 * Follows honesty rules: generic chat icon on small green tile, luxury gold button styling.
 */
export function FloatingCta() {
  const [show, setShow] = useState(false);
  const { isOpen } = useBooking();

  useEffect(() => {
    const on = () => {
      const scrollY = window.scrollY;
      const pastHero = scrollY > (window.innerWidth < 640 ? 320 : window.innerHeight * 0.6);

      const bookingEl = document.getElementById("booking");
      let inBookingSection = false;
      if (bookingEl) {
        const rect = bookingEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 60) {
          inBookingSection = true;
        }
      }

      setShow(pastHero && !inBookingSection);
    };

    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const visible = show && !isOpen;

  return (
    <>
      {/* Desktop Floating Pill */}
      <div
        className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-500 sm:block ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <BookButton
          className="group flex h-14 items-center gap-3 border border-gold/40 bg-surface/90 px-6 text-[14px] font-semibold text-cream shadow-gold backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-gold-lg"
          aria-label="Book Consultation (+91 95629 80890)"
        >
          <MessageCircle size={20} className="text-gold shrink-0" aria-hidden />
          <div className="flex flex-col text-left">
            <span className="text-[14px] font-semibold leading-tight text-cream">Book Consultation</span>
            <span className="text-[11px] font-normal text-gold-champagne font-mono">+91 95629 80890</span>
          </div>
        </BookButton>
      </div>

      {/* Mobile Floating Bar */}
      <div
        className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-500 sm:hidden ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        }`}
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <BookButton className="btn-primary h-12 w-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(26,4,33,0.85)] rounded-full border border-gold/40">
          <MessageCircle size={18} aria-hidden />
          Book Appointment
        </BookButton>
      </div>
    </>
  );
}

