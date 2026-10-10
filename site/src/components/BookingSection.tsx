"use client";

import { CalendarDays, Clock, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { clinic, treatments } from "@/lib/clinic.config";
import { bookingMessage, openWhatsApp } from "@/lib/whatsapp";
import { emptyForm, Form, formatDateDisplay, nextDays, SLOTS, slotLabel, todayISO, validateBooking } from "./booking";

export function BookingSection() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);
  const uid = useId();

  const days = useMemo(() => nextDays(10), []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

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
      const el = document.getElementById(`${uid}-${firstBad}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      // preventScroll stops the focus() jump from fighting the smooth scroll on mobile
      el?.focus({ preventScroll: true });
      return;
    }
    openWhatsApp(bookingMessage(form));
    setSent(true);
  };

  // text-[16px] on mobile: iOS Safari zooms the page when focusing inputs smaller than 16px
  const field =
    "mt-1.5 block w-full min-w-0 max-w-full box-border border border-line-strong bg-surface/70 min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-[16px] sm:text-[15px] text-cream placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold rounded-sm";
  const chipBase = "rounded-sm border transition-colors select-none [-webkit-tap-highlight-color:transparent]";
  const chipOn = "border-gold bg-gold text-[#26082F] font-semibold shadow-sm";
  const chipOff = "border-line bg-surface/60 text-cream hover:border-gold/50 active:border-gold";

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

  const perks = [
    { icon: ShieldCheck, title: "No Waiting Lines", body: "Direct appointment booking with confirmation via WhatsApp." },
    { icon: MapPin, title: "4 Locations Across Kochi", body: "Ernakulam, Aluva, Kakkanad & Angamaly." },
  ];

  return (
    <section
      id="booking"
      className="relative overflow-hidden border-t border-line bg-surface/30 py-14 sm:py-24 lg:py-32 scroll-mt-16"
      aria-labelledby="booking-title"
    >
      <div className="wrap">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: context & reassurance */}
          <div className="min-w-0 lg:col-span-5" data-reveal>
            <p className="label">Simple Appointment Booking</p>
            <h2
              id="booking-title"
              className="mt-3 sm:mt-4 text-[clamp(28px,7vw,68px)] font-light leading-[1.05] tracking-hero text-cream text-balance"
            >
              Book your visit in<br className="hidden sm:block" />{" "}
              <span className="text-gold-champagne font-normal">one quick conversation.</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-[14px] sm:text-[15px] leading-[1.65] text-muted">
              Select your preferred treatment, date, and consultation centre in Ernakulam, Aluva, Kakkanad, or Angamaly. We will prepare your detailed request and open WhatsApp directly with Dr. Pinky Varghese’s clinic desk.
            </p>

            {/* Compact on phones, 3-up on tablets, stacked again beside the form on desktop */}
            <div className="mt-6 sm:mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1 border-t border-line/70 pt-5 sm:pt-6">
              {perks.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3 min-w-0">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne shrink-0">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-semibold text-cream">{title}</h4>
                    <p className="text-[12px] leading-snug text-muted">{body}</p>
                  </div>
                </div>
              ))}

              <a
                href="https://wa.me/919562980890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne shrink-0">
                  <MessageCircle size={16} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-[14px] font-semibold text-cream">WhatsApp Helpline</h4>
                  <p className="text-[12px] font-mono text-gold-champagne whitespace-nowrap">+91 95629 80890</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: the form */}
          <div className="min-w-0 lg:col-span-7" data-reveal style={{ ["--d" as string]: 1 }}>
            {/* On phones the card bleeds closer to the edges to give fields more width */}
            <div className="-mx-2 sm:mx-0 border border-line bg-gradient-to-b from-royal/40 via-surface/80 to-bg p-4 sm:p-8 lg:p-10 shadow-royal">
              <h3 className="text-[19px] sm:text-[22px] font-normal tracking-tight text-cream">
                Consultation Request Form
              </h3>
              <p className="mt-1 text-[12px] sm:text-[13px] text-muted">
                Fields marked with <span className="text-gold">*</span> are required.
              </p>

              <form onSubmit={submit} noValidate className="mt-5 sm:mt-6 space-y-5">
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-name`} className="block text-[13px] font-medium text-cream">
                      Full Name <span className="text-gold">*</span>
                    </label>
                    <input
                      {...aria("name")}
                      className={field}
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                    {err("name")}
                  </div>

                  {/* Phone Number */}
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-phone`} className="block text-[13px] font-medium text-cream">
                      Phone Number <span className="text-gold">*</span>
                    </label>
                    <input
                      {...aria("phone")}
                      className={field}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      enterKeyHint="next"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 95629 80890"
                      required
                    />
                    {err("phone")}
                  </div>
                </div>

                {/* Treatment */}
                <div className="min-w-0">
                  <label htmlFor={`${uid}-treatment`} className="block text-[13px] font-medium text-cream">
                    Preferred Treatment <span className="text-gold">*</span>
                  </label>
                  <select
                    {...aria("treatment")}
                    className={`${field} truncate appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%23D4AF6A%22 fill=%22none%22 stroke-width=%221.5%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
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

                {/* Location: 2 columns on phones, 4 in a row from tablet up */}
                <fieldset className="min-w-0">
                  <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    <MapPin size={13} className="text-gold" /> Consultation Location
                  </legend>
                  <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {clinic.locations.map((loc) => {
                      const on = form.location === loc.name;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("location", loc.name)}
                          className={`${chipBase} flex h-11 min-w-0 items-center justify-center px-2 text-center text-[13px] font-medium ${on ? chipOn : chipOff}`}
                        >
                          <span className="truncate">{loc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Date chips. min-w-0 matters: fieldsets default to min-width:min-content,
                    which made the scrolling chip row push the whole page wider than the screen. */}
                <fieldset className="min-w-0" aria-describedby={errors.date ? `${uid}-date-err` : undefined}>
                  <div className="flex items-center justify-between gap-2">
                    <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                      <CalendarDays size={14} className="text-gold" /> Preferred Date <span className="text-gold">*</span>
                    </legend>
                    {form.date && (
                      <span className="truncate text-[11px] font-semibold text-gold-champagne">
                        {formatDateDisplay(form.date)}
                      </span>
                    )}
                  </div>

                  {/* Edge-to-edge scroller on phones; no touch-pan-x so vertical page scroll still works */}
                  <div className="-mx-4 sm:mx-0 mt-2 px-4 sm:px-0 scroll-px-4 sm:scroll-px-0 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain">
                    {days.map((d) => {
                      const on = form.date === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("date", d.iso)}
                          className={`${chipBase} flex h-[64px] w-[56px] shrink-0 snap-start flex-col items-center justify-center ${on ? chipOn : chipOff}`}
                        >
                          <span className={`text-[10px] font-medium ${on ? "text-[#26082F]" : "text-gold-champagne"}`}>{d.dow}</span>
                          <span className="text-[18px] font-medium leading-none my-0.5">{d.day}</span>
                          <span className={`text-[10px] ${on ? "text-[#26082F]" : "text-muted"}`}>{d.mon}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom date trigger (native input overlaid, invisible) */}
                  <div className="relative mt-2">
                    <div className="flex min-h-[48px] items-center justify-between border border-line-strong bg-surface/60 px-3.5 py-2.5 rounded-sm transition-colors hover:border-gold">
                      <div className="flex items-center gap-2 text-[13px] min-w-0">
                        <CalendarDays size={15} className="text-gold shrink-0" />
                        <span className={form.date ? "text-cream font-medium truncate" : "text-muted truncate"}>
                          {form.date ? `Date: ${formatDateDisplay(form.date)}` : "Or pick from calendar"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-champagne shrink-0 ml-2">Select</span>
                    </div>
                    <input
                      {...aria("date")}
                      type="date"
                      min={todayISO()}
                      value={form.date}
                      onChange={set("date")}
                      className="absolute inset-0 h-full w-full min-w-0 appearance-none opacity-0 cursor-pointer text-[16px] [color-scheme:dark]"
                      aria-label="Choose specific appointment date"
                    />
                  </div>
                  {err("date")}
                </fieldset>

                {/* Time slot chips: 3 per row on phones, 6 from tablet up */}
                <fieldset className="min-w-0" aria-describedby={errors.time ? `${uid}-time-err` : undefined}>
                  <div className="flex items-center justify-between gap-2">
                    <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                      <Clock size={14} className="text-gold" /> Preferred Time Slot <span className="text-gold">*</span>
                    </legend>
                    {form.time && (
                      <span className="truncate text-[11px] font-semibold text-gold-champagne">{slotLabel(form.time)}</span>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {SLOTS.map((t) => {
                      const on = form.time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("time", t)}
                          className={`${chipBase} h-11 min-w-0 px-1 text-center text-[13px] font-medium whitespace-nowrap ${on ? chipOn : chipOff}`}
                        >
                          {slotLabel(t)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative mt-2">
                    <div className="flex min-h-[48px] items-center justify-between border border-line-strong bg-surface/60 px-3.5 py-2.5 rounded-sm transition-colors hover:border-gold">
                      <div className="flex items-center gap-2 text-[13px] min-w-0">
                        <Clock size={15} className="text-gold shrink-0" />
                        <span className={form.time ? "text-cream font-medium truncate" : "text-muted truncate"}>
                          {form.time ? `Time: ${slotLabel(form.time)}` : "Or set a custom time"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-champagne shrink-0 ml-2">Select</span>
                    </div>
                    <input
                      {...aria("time")}
                      type="time"
                      step={900}
                      value={form.time}
                      onChange={set("time")}
                      className="absolute inset-0 h-full w-full min-w-0 appearance-none opacity-0 cursor-pointer text-[16px] [color-scheme:dark]"
                      aria-label="Choose custom appointment time"
                    />
                  </div>
                  {err("time")}
                </fieldset>

                {/* Optional Message */}
                <div className="min-w-0">
                  <label htmlFor={`${uid}-notes`} className="block text-[13px] font-medium text-cream">
                    Optional Message / Specific Questions
                  </label>
                  <textarea
                    {...aria("notes")}
                    className={`${field} min-h-[88px] resize-y`}
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Tell us about your dental needs or preferred consultation time..."
                    maxLength={500}
                  />
                </div>

                <div className="pt-1 sm:pt-2">
                  <button
                    type="submit"
                    className="btn-primary h-[52px] sm:h-14 w-full text-[16px] flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={19} aria-hidden /> Book Now
                  </button>
                  <p className="mt-3 text-center text-[12px] leading-snug text-muted break-words" aria-live="polite">
                    {sent
                      ? "WhatsApp opened! Send the prepared message to confirm your appointment."
                      : "Opens WhatsApp with your request ready to send to +91 95629 80890."}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}