"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { clinic, treatments } from "@/lib/clinic.config";
import { bookingMessage, enquiryMessage, openWhatsApp, whatsappUrl } from "@/lib/whatsapp";

type Ctx = {
  open: (treatment?: string, location?: string) => void;
};

const BookingContext = createContext<Ctx>({ open: () => {} });
export const useBooking = () => useContext(BookingContext);

/**
 * Reusable appointment CTA. Real wa.me link (works without JavaScript);
 * with JavaScript it opens the booking drawer preselecting treatment and location.
 */
export function BookButton({
  treatment,
  location,
  className = "btn-primary",
  children,
  direct = false,
  ...rest
}: {
  treatment?: string;
  location?: string;
  className?: string;
  children: React.ReactNode;
  /** skip the drawer and open WhatsApp straight away */
  direct?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const { open } = useBooking();
  return (
    <a
      href={whatsappUrl(enquiryMessage(treatment, location))}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (direct) return; // let the link open WhatsApp directly
        e.preventDefault();
        open(treatment, location);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export type Form = {
  name: string;
  phone: string;
  treatment: string;
  location: string;
  date: string;
  time: string;
  notes: string;
};

export const emptyForm: Form = {
  name: "",
  phone: "",
  treatment: "",
  location: "Ernakulam",
  date: "",
  time: "",
  notes: "",
};

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function validateBooking(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.name || f.name.trim().length < 2) {
    e.name = "Please enter your full name.";
  }
  const digits = f.phone.replace(/\D/g, "");
  if (!f.phone || digits.length < 10 || digits.length > 13) {
    e.phone = "Please enter a valid 10-digit phone number.";
  }
  if (!f.treatment) {
    e.treatment = "Please select a preferred dental treatment or consultation.";
  }
  if (!f.date) {
    e.date = "Please select a preferred appointment date.";
  } else if (f.date < todayISO()) {
    e.date = "Please choose today or a future date.";
  }
  if (!f.time) {
    e.time = "Please choose a preferred time slot.";
  }
  return e;
}

export function nextDays(n: number) {
  const out: { iso: string; dow: string; day: string; mon: string }[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    out.push({
      iso,
      dow: i === 0 ? "Today" : i === 1 ? "Tmrw" : x.toLocaleDateString("en-IN", { weekday: "short" }),
      day: String(x.getDate()),
      mon: x.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return out;
}

export const SLOTS = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];
export const slotLabel = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const [desk, setDesk] = useState(true);

  const open = useCallback((treatment?: string, location?: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setForm((f) => ({
      ...f,
      treatment: treatment ?? f.treatment,
      location: location ?? f.location ?? "Ernakulam",
    }));
    setErrors({});
    setSent(false);
    setDesk(window.matchMedia("(min-width: 640px)").matches);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => lastFocus.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href],button,input,select,textarea")).filter((el) => !el.hasAttribute("disabled"));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const days = useMemo(() => nextDays(14), [isOpen]);
  const pick = (k: "date" | "time" | "location", v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as keyof Form]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = validateBooking(form);
    setErrors(er);
    const firstBad = Object.keys(er)[0];
    if (firstBad) {
      const el = panel.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
      return;
    }
    openWhatsApp(bookingMessage(form));
    setSent(true);
  };

  const field =
    "mt-1.5 block w-full border border-line-strong bg-surface/80 min-h-[48px] px-4 py-3 text-[15px] text-cream placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold";
  const err = (k: keyof Form) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1 text-[12px] font-medium text-[#fca5a5]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Form) => ({
    id: `${uid}-${k}`,
    name: k,
    "aria-invalid": !!errors[k] || undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-stretch sm:justify-end" role="presentation">
            <motion.div
              className="absolute inset-0 bg-[#120217]/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              onClick={close}
            />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              tabIndex={-1}
              className="relative flex max-h-[96dvh] w-full flex-col overflow-y-auto overscroll-contain border-t outline-none border-line-strong bg-bg sm:max-h-none sm:h-full sm:w-[500px] sm:border-l sm:border-t-0 shadow-2xl"
              initial={reduce ? { opacity: 0 } : desk ? { x: "100%" } : { y: "100%" }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : desk ? { x: "100%" } : { y: "100%" }}
              transition={{ type: "tween", ease: [0.2, 0.7, 0.2, 1], duration: reduce ? 0 : 0.45 }}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal/40 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-32 h-60 w-60 rounded-full bg-gold/15 blur-3xl" />

              <div className="relative flex items-start justify-between px-5 pb-2 pt-4 sm:px-8 sm:pt-8">
                <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-cream/20 sm:hidden" aria-hidden />
                <div>
                  <p className="label">Dr. Pinky Varghese</p>
                  <h2 id={`${uid}-title`} className="mt-1 text-[24px] sm:text-[28px] font-light leading-[1.1] tracking-tight text-cream">
                    Book on <span className="text-gold-champagne">WhatsApp</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="grid h-11 w-11 place-items-center border border-line text-gold-champagne transition-colors hover:border-gold hover:text-cream hover:bg-surface/50"
                  aria-label="Close booking form"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="relative px-5 text-[13px] leading-relaxed text-muted sm:px-8">
                Official WhatsApp: <strong className="text-gold-champagne font-semibold">+91 95629 80890</strong>. Appointments are confirmed directly with the clinic team.
              </p>

              <form onSubmit={submit} noValidate className="relative flex flex-1 flex-col gap-5 px-5 pb-6 pt-5 sm:px-8">
                {/* Full Name */}
                <div>
                  <label htmlFor={`${uid}-name`} className="text-[13px] font-medium text-cream">
                    Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    {...aria("name")}
                    className={field}
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                  {err("name")}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor={`${uid}-phone`} className="text-[13px] font-medium text-cream">
                    Phone / WhatsApp Number <span className="text-gold">*</span>
                  </label>
                  <input
                    {...aria("phone")}
                    className={field}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 95629 80890"
                    required
                  />
                  {err("phone")}
                </div>

                {/* Preferred Treatment */}
                <div>
                  <label htmlFor={`${uid}-treatment`} className="text-[13px] font-medium text-cream">
                    Preferred Treatment <span className="text-gold">*</span>
                  </label>
                  <select
                    {...aria("treatment")}
                    className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%23D4AF6A%22 fill=%22none%22 stroke-width=%221.5%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
                    value={form.treatment}
                    onChange={set("treatment")}
                    required
                  >
                    <option value="" disabled className="bg-bg text-cream">Select a treatment</option>
                    {treatments.map((t) => (
                      <option key={t.id} value={t.name} className="bg-bg text-cream">
                        {t.name}
                      </option>
                    ))}
                    <option value="Consultation / Smile Evaluation" className="bg-bg text-cream">
                      Consultation / Smile Evaluation
                    </option>
                  </select>
                  {err("treatment")}
                </div>

                {/* Preferred Location */}
                <div>
                  <label htmlFor={`${uid}-location`} className="text-[13px] font-medium text-cream flex items-center gap-1.5">
                    <MapPin size={14} className="text-gold" /> Consultation Location
                  </label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {clinic.locations.map((loc) => {
                      const on = form.location === loc.name;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("location", loc.name)}
                          className={`h-11 border text-[13px] font-medium transition-colors ${
                            on
                              ? "border-gold bg-gold text-[#26082F] font-semibold"
                              : "border-line bg-surface/50 text-cream/90 hover:border-gold/50"
                          }`}
                        >
                          {loc.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Date */}
                <fieldset aria-describedby={errors.date ? `${uid}-date-err` : undefined}>
                  <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    <CalendarDays size={14} className="text-gold" aria-hidden /> Preferred Appointment Date <span className="text-gold">*</span>
                  </legend>
                  <div className="-mx-5 mt-2 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8">
                    {days.map((d) => {
                      const on = form.date === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${d.dow} ${d.day} ${d.mon}`}
                          onClick={() => pick("date", d.iso)}
                          className={`flex h-[68px] w-[58px] shrink-0 snap-start flex-col items-center justify-center border transition-colors ${
                            on
                              ? "border-gold bg-gold text-[#26082F] font-semibold"
                              : "border-line bg-surface/60 text-cream active:bg-surface"
                          }`}
                        >
                          <span className={`text-[10px] font-medium ${on ? "text-[#26082F]" : "text-gold-champagne"}`}>
                            {d.dow}
                          </span>
                          <span className="text-[20px] font-medium leading-none">{d.day}</span>
                          <span className={`text-[10px] ${on ? "text-[#26082F]" : "text-muted"}`}>
                            {d.mon}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-2.5 flex items-center gap-3 text-[12px] text-muted">
                    <span className="w-[84px] shrink-0 text-cream/80">Other date:</span>
                    <input
                      {...aria("date")}
                      className={`${field} !mt-0 min-w-0 flex-1 !w-auto [color-scheme:dark]`}
                      type="date"
                      min={todayISO()}
                      value={form.date}
                      onChange={set("date")}
                    />
                  </label>
                  {err("date")}
                </fieldset>

                {/* Preferred Time */}
                <fieldset aria-describedby={errors.time ? `${uid}-time-err` : undefined}>
                  <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    <Clock size={14} className="text-gold" aria-hidden /> Preferred Time Slot <span className="text-gold">*</span>
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {SLOTS.map((t) => {
                      const on = form.time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("time", t)}
                          className={`h-11 border text-[13px] font-medium transition-colors ${
                            on
                              ? "border-gold bg-gold text-[#26082F] font-semibold"
                              : "border-line bg-surface/60 text-cream hover:border-gold/50"
                          }`}
                        >
                          {slotLabel(t)}
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-2.5 flex items-center gap-3 text-[12px] text-muted">
                    <span className="w-[84px] shrink-0 text-cream/80">Other time:</span>
                    <input
                      {...aria("time")}
                      className={`${field} !mt-0 min-w-0 flex-1 !w-auto [color-scheme:dark]`}
                      type="time"
                      step={900}
                      value={form.time}
                      onChange={set("time")}
                    />
                  </label>
                  {err("time")}
                </fieldset>

                {/* Optional Message */}
                <div>
                  <label htmlFor={`${uid}-notes`} className="text-[13px] font-medium text-cream">
                    Optional Message / Clinical Notes
                  </label>
                  <textarea
                    {...aria("notes")}
                    className={`${field} min-h-[76px] resize-y`}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Tell Dr. Pinky about your dental concern or treatment goals..."
                    maxLength={500}
                  />
                </div>

                {/* Submit Bar */}
                <div className="sticky bottom-0 -mx-5 mt-auto flex flex-col gap-2 border-t border-line bg-bg/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:-mx-8 sm:px-8">
                  <button type="submit" className="btn-primary h-14 w-full text-[16px]">
                    <MessageCircle size={19} aria-hidden /> Open WhatsApp Request
                  </button>
                  <p aria-live="polite" className="text-center text-[12px] leading-snug text-muted">
                    {sent
                      ? "WhatsApp opened! Send the prepared message to confirm your slot with Dr. Pinky."
                      : "Generates your prefilled message to +91 95629 80890. Appointment confirmed upon clinic reply."}
                  </p>
                  <a
                    href="https://wa.me/919562980890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[38px] items-center justify-center text-[13px] font-medium text-gold-champagne hover:underline"
                  >
                    Skip form — chat directly on WhatsApp
                  </a>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
