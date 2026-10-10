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
    const on = () => setShow(window.scrollY > (window.innerWidth < 640 ? 320 : window.innerHeight * 0.6));
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
          aria-label="Book Now (+91 95629 80890)"
        >
          <MessageCircle size={20} className="text-gold shrink-0" aria-hidden />
          <div className="flex flex-col text-left">
            <span className="text-[14px] font-semibold leading-tight text-cream">Book Now</span>
            <span className="text-[11px] font-normal text-gold-champagne font-mono">+91 95629 80890</span>
          </div>
        </BookButton>
      </div>

      {/* Mobile Sticky Bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur-2xl transition-transform duration-500 sm:hidden ${
          visible ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <BookButton className="btn-primary h-13 sm:h-14 w-full text-[15px] sm:text-[16px] flex items-center justify-center gap-2">
          <MessageCircle size={19} aria-hidden />
          Book Now
        </BookButton>
      </div>
    </>
  );
}

