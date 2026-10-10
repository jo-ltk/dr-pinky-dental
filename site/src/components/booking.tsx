"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { clinic, treatments } from "@/lib/clinic.config";
import { bookingMessage, enquiryMessage, openWhatsApp, whatsappUrl } from "@/lib/whatsapp";

type Ctx = {
  open: (treatment?: string, location?: string) => void;
  isOpen: boolean;
};

const BookingContext = createContext<Ctx>({ open: () => {}, isOpen: false });
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

export function formatDateDisplay(iso: string) {
  if (!iso) return "";
  try {
    const parts = iso.split("-").map(Number);
    if (parts.length !== 3) return iso;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = todayISO();
    const tmrwDate = new Date();
    tmrwDate.setDate(tmrwDate.getDate() + 1);
    const tmrw = tmrwDate.toISOString().slice(0, 10);

    const formatted = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    if (iso === today) return `Today · ${formatted}`;
    if (iso === tmrw) return `Tomorrow · ${formatted}`;
    return formatted;
  } catch {
    return iso;
  }
}

export const SLOTS = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];
export const slotLabel = (t: string) => {
  if (!t) return "";
  try {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
  } catch {
    return t;
  }
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
  const [desk, setDesk] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    setDesk(mql.matches);
    const handler = (e: MediaQueryListEvent) => setDesk(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const open = useCallback((treatment?: string, location?: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setForm((f) => ({
      ...f,
      treatment: treatment ?? f.treatment,
      location: location ?? f.location ?? "Ernakulam",
    }));
    setErrors({});
    setSent(false);
    if (typeof window !== "undefined") {
      setDesk(window.matchMedia("(min-width: 640px)").matches);
    }
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => lastFocus.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const t = setTimeout(() => panel.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(
          panel.current.querySelectorAll<HTMLElement>("a[href],button,input,select,textarea")
        ).filter((el) => !el.hasAttribute("disabled"));
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
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
    "mt-1.5 block w-full max-w-full box-border border border-line-strong bg-surface/80 min-h-[46px] sm:min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] text-cream placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold rounded-sm";
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
    <BookingContext.Provider value={{ open, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center sm:items-stretch sm:justify-end overflow-hidden"
            role="presentation"
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-[#120217]/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              onClick={close}
            />

            {/* Modal / Drawer Dialog */}
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              tabIndex={-1}
              className="relative z-10 flex h-auto max-h-[92dvh] w-full max-w-[100vw] sm:max-w-[480px] sm:w-[480px] sm:h-full sm:max-h-none flex-col overflow-hidden rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-line-strong bg-bg shadow-2xl outline-none"
              initial={reduce ? { opacity: 0 } : desk ? { x: "100%" } : { y: "100%" }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : desk ? { x: "100%" } : { y: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: reduce ? 0 : 0.4 }}
              style={{ touchAction: "pan-y" }}
            >
              {/* Background ambient lighting strictly confined */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-royal/40 blur-3xl" />
              <div className="pointer-events-none absolute -left-16 bottom-24 h-52 w-52 rounded-full bg-gold/15 blur-3xl" />

              {/* Fixed Top Header Bar */}
              <div className="relative shrink-0 border-b border-line/60 bg-bg/95 px-4 pt-3.5 pb-3 sm:px-6 sm:pt-6 sm:pb-4 backdrop-blur-md">
                <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-cream/25 sm:hidden" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="label">Dr. Pinky Varghese</p>
                    <h2
                      id={`${uid}-title`}
                      className="mt-0.5 text-[21px] sm:text-[26px] font-light leading-[1.15] tracking-tight text-cream"
                    >
                      Book on <span className="text-gold-champagne font-normal">WhatsApp</span>
                    </h2>
                    <p className="mt-0.5 text-[12px] sm:text-[13px] leading-snug text-muted">
                      Official: <strong className="text-gold-champagne font-semibold font-mono">+91 95629 80890</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="shrink-0 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-sm border border-line-strong text-gold-champagne transition-colors hover:border-gold hover:text-cream hover:bg-surface/50 active:scale-95"
                    aria-label="Close booking form"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Body */}
              <div className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                <form id={`${uid}-booking-form`} onSubmit={submit} noValidate className="flex flex-col gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div className="w-full">
                    <label htmlFor={`${uid}-name`} className="block text-[13px] font-medium text-cream">
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
                  <div className="w-full">
                    <label htmlFor={`${uid}-phone`} className="block text-[13px] font-medium text-cream">
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
                  <div className="w-full">
                    <label htmlFor={`${uid}-treatment`} className="block text-[13px] font-medium text-cream">
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

                  {/* Consultation Location */}
                  <div className="w-full">
                    <label htmlFor={`${uid}-location`} className="block text-[13px] font-medium text-cream">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-gold" /> Consultation Location
                      </span>
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
                            className={`flex h-11 items-center justify-center rounded-sm border px-2 text-center text-[12px] sm:text-[13px] font-medium transition-colors ${
                              on
                                ? "border-gold bg-gold text-[#26082F] font-semibold shadow-sm"
                                : "border-line bg-surface/50 text-cream/90 hover:border-gold/50 hover:bg-surface"
                            }`}
                          >
                            <span className="truncate">{loc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Appointment Date */}
                  <fieldset className="w-full" aria-describedby={errors.date ? `${uid}-date-err` : undefined}>
                    <div className="flex items-center justify-between">
                      <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                        <CalendarDays size={14} className="text-gold" aria-hidden /> Preferred Date <span className="text-gold">*</span>
                      </legend>
                      {form.date && (
                        <span className="text-[11px] font-semibold text-gold-champagne">
                          {formatDateDisplay(form.date)}
                        </span>
                      )}
                    </div>

                    {/* Quick Date Chips Carousel */}
                    <div className="mt-2 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] touch-pan-x overscroll-x-contain">
                      {days.map((d) => {
                        const on = form.date === d.iso;
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            aria-pressed={on}
                            aria-label={`${d.dow} ${d.day} ${d.mon}`}
                            onClick={() => pick("date", d.iso)}
                            className={`flex h-[66px] w-[56px] shrink-0 snap-start flex-col items-center justify-center rounded-sm border transition-colors ${
                              on
                                ? "border-gold bg-gold text-[#26082F] font-semibold shadow-sm"
                                : "border-line bg-surface/60 text-cream hover:border-gold/50 active:bg-surface"
                            }`}
                          >
                            <span className={`text-[10px] font-medium ${on ? "text-[#26082F]" : "text-gold-champagne"}`}>
                              {d.dow}
                            </span>
                            <span className="text-[19px] font-medium leading-none my-0.5">{d.day}</span>
                            <span className={`text-[10px] ${on ? "text-[#26082F]" : "text-muted"}`}>
                              {d.mon}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Styled Custom Date Trigger - Fixes iOS Blank Input Box */}
                    <div className="relative mt-2">
                      <div className="flex min-h-[44px] items-center justify-between border border-line-strong bg-surface/60 px-3.5 py-2.5 rounded-sm transition-colors hover:border-gold">
                        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] min-w-0">
                          <CalendarDays size={15} className="text-gold shrink-0" />
                          <span className={form.date ? "text-cream font-medium truncate" : "text-muted truncate"}>
                            {form.date ? `Date: ${formatDateDisplay(form.date)}` : "Or pick specific date from calendar..."}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-champagne shrink-0 ml-2">
                          Select
                        </span>
                      </div>
                      <input
                        {...aria("date")}
                        type="date"
                        min={todayISO()}
                        value={form.date}
                        onChange={set("date")}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer [color-scheme:dark]"
                        aria-label="Choose specific appointment date"
                      />
                    </div>
                    {err("date")}
                  </fieldset>

                  {/* Preferred Time Slot */}
                  <fieldset className="w-full" aria-describedby={errors.time ? `${uid}-time-err` : undefined}>
                    <div className="flex items-center justify-between">
                      <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                        <Clock size={14} className="text-gold" aria-hidden /> Preferred Time Slot <span className="text-gold">*</span>
                      </legend>
                      {form.time && (
                        <span className="text-[11px] font-semibold text-gold-champagne">
                          {slotLabel(form.time)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {SLOTS.map((t) => {
                        const on = form.time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => pick("time", t)}
                            className={`h-11 rounded-sm border px-1 text-[12px] sm:text-[13px] font-medium transition-colors text-center ${
                              on
                                ? "border-gold bg-gold text-[#26082F] font-semibold shadow-sm"
                                : "border-line bg-surface/60 text-cream hover:border-gold/50 active:bg-surface"
                            }`}
                          >
                            {slotLabel(t)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Styled Custom Time Trigger - Fixes iOS Blank Input Box */}
                    <div className="relative mt-2">
                      <div className="flex min-h-[44px] items-center justify-between border border-line-strong bg-surface/60 px-3.5 py-2.5 rounded-sm transition-colors hover:border-gold">
                        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] min-w-0">
                          <Clock size={15} className="text-gold shrink-0" />
                          <span className={form.time ? "text-cream font-medium truncate" : "text-muted truncate"}>
                            {form.time ? `Time: ${slotLabel(form.time)}` : "Or set custom time..."}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-champagne shrink-0 ml-2">
                          Select
                        </span>
                      </div>
                      <input
                        {...aria("time")}
                        type="time"
                        step={900}
                        value={form.time}
                        onChange={set("time")}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer [color-scheme:dark]"
                        aria-label="Choose custom appointment time"
                      />
                    </div>
                    {err("time")}
                  </fieldset>

                  {/* Optional Message */}
                  <div className="w-full">
                    <label htmlFor={`${uid}-notes`} className="block text-[13px] font-medium text-cream">
                      Optional Message / Clinical Notes
                    </label>
                    <textarea
                      {...aria("notes")}
                      className={`${field} min-h-[72px] resize-y`}
                      value={form.notes}
                      onChange={set("notes")}
                      placeholder="Tell Dr. Pinky about your dental concern or treatment goals..."
                      maxLength={500}
                    />
                  </div>
                </form>
              </div>

              {/* Sticky Bottom Submit Bar */}
              <div className="relative shrink-0 border-t border-line/70 bg-bg/98 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-4 sm:pb-5 backdrop-blur-lg">
                <button
                  type="submit"
                  form={`${uid}-booking-form`}
                  className="btn-primary h-13 sm:h-14 w-full text-[15px] sm:text-[16px] shadow-gold flex items-center justify-center gap-2"
                >
                  <MessageCircle size={19} aria-hidden /> Open WhatsApp Request
                </button>
                <p aria-live="polite" className="mt-2 text-center text-[11px] sm:text-[12px] leading-tight text-muted">
                  {sent
                    ? "WhatsApp opened! Send the prepared message to confirm your slot with Dr. Pinky."
                    : "Generates your prefilled message to +91 95629 80890. Appointment confirmed upon clinic reply."}
                </p>
                <a
                  href="https://wa.me/919562980890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex min-h-[36px] items-center justify-center text-[12px] sm:text-[13px] font-medium text-gold-champagne hover:underline"
                >
                  Skip form — chat directly on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}

