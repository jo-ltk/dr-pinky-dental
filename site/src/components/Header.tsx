"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BookButton } from "./booking";
import { clinic } from "@/lib/clinic.config";

const nav = [
  { href: "#services", label: "Dental Services" },
  { href: "#doctor", label: "Dr. Pinky Varghese" },
  { href: "#why-us", label: "Why Choose Us" },
  { href: "#locations", label: "Consultation Locations" },
  { href: "#booking", label: "Book Appointment" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [menu]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || menu
          ? "border-b border-line bg-bg/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(38,8,47,0.7)]"
          : "border-b border-line/40 bg-bg/70 backdrop-blur-md"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-bg font-semibold"
      >
        Skip to content
      </a>
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          aria-label={`${clinic.fullName} — Consultant Implantologist & Smile Designer`}
          className="group inline-flex min-h-[44px] shrink-0 items-center gap-3 transition-opacity hover:opacity-95"
        >
          <img
            src="/logo-icon.png"
            alt=""
            width={239}
            height={192}
            className="h-11 sm:h-[52px] w-auto object-contain select-none transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="hidden sm:flex flex-col whitespace-nowrap">
            <span className="text-[16px] font-medium tracking-tight2 text-cream">{clinic.fullName}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-champagne">{clinic.title}</span>
          </div>
        </a>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-6 2xl:gap-8">
            {nav.filter((n) => n.href !== "#booking").map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-cream/80 transition-colors hover:text-gold-champagne"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-gold/50 transition-colors group-hover:bg-gold"
                    aria-hidden
                  />
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <BookButton className="btn-primary !h-10 !px-4 !text-[13px] sm:!h-11 sm:!px-5 sm:!text-[14px]">
            <MessageCircle size={16} aria-hidden />
            Book Now
          </BookButton>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-line-strong bg-surface/60 text-gold-champagne xl:hidden transition-colors hover:border-gold hover:text-cream"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[45] overflow-y-auto overflow-x-hidden bg-bg/95 backdrop-blur-2xl xl:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-royal/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-28 bottom-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

            <ul className="wrap relative flex flex-col pt-6">
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                >
                  <a
                    href={n.href}
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between border-b border-line py-4 text-[24px] font-light tracking-tight2 text-cream hover:text-gold-champagne"
                  >
                    {n.label}
                    <ArrowUpRight size={20} className="text-gold" aria-hidden />
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="wrap relative pb-28 pt-8">
              <BookButton className="btn-primary w-full" onClickCapture={() => setMenu(false)}>
                <MessageCircle size={18} aria-hidden /> Book on WhatsApp
              </BookButton>
              <p className="mt-4 text-center text-[12px] text-muted">
                Consultations in Ernakulam · Aluva · Kakkanad · Angamaly
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
