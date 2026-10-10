"use client";

import { CalendarDays, Clock, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { clinic, treatments } from "@/lib/clinic.config";
import { bookingMessage, openWhatsApp } from "@/lib/whatsapp";
import { emptyForm, Form, nextDays, SLOTS, slotLabel, todayISO, validateBooking } from "./booking";

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
      el?.focus();
      return;
    }
    openWhatsApp(bookingMessage(form));
    setSent(true);
  };

  const field =
    "mt-1.5 block w-full max-w-full box-border border border-line-strong bg-surface/70 min-h-[46px] sm:min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] text-cream placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold rounded-sm";
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
    <section id="booking" className="relative overflow-hidden border-t border-line bg-surface/30 py-20 sm:py-32" aria-labelledby="booking-title">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: context & reassurance */}
          <div className="lg:col-span-5" data-reveal>
            <p className="label">Simple Appointment Booking</p>
            <h2
              id="booking-title"
              className="mt-4 text-[clamp(32px,4.5vw,68px)] font-light leading-[1] tracking-hero text-cream"
            >
              Book your visit in<br />
              <span className="text-gold-champagne font-normal">one quick conversation.</span>
            </h2>

            <p className="mt-5 sm:mt-6 text-[14px] sm:text-[15px] leading-[1.65] text-muted">
              Select your preferred treatment, date, and consultation centre in Ernakulam, Aluva, Kakkanad, or Angamaly. We will prepare your detailed request and open WhatsApp directly with Dr. Pinky Varghese’s clinic desk.
            </p>

            <div className="mt-8 space-y-4 border-t border-line/70 pt-6">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne shrink-0">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h4 className="text-[14px] font-semibold text-cream">No Waiting Lines</h4>
                  <p className="text-[12px] text-muted">Direct appointment booking with confirmation via WhatsApp.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne shrink-0">
                  <MapPin size={16} />
                </span>
                <div>
                  <h4 className="text-[14px] font-semibold text-cream">4 Locations Across Kochi</h4>
                  <p className="text-[12px] text-muted">Consultation slots coordinated in Ernakulam, Aluva, Kakkanad & Angamaly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-champagne shrink-0">
                  <MessageCircle size={16} />
                </span>
                <div>
                  <h4 className="text-[14px] font-semibold text-cream">WhatsApp Helpline</h4>
                  <p className="text-[12px] text-muted font-mono text-gold-champagne">+91 95629 80890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: the complete interactive form */}
          <div className="lg:col-span-7" data-reveal style={{ ["--d" as string]: 1 }}>
            <div className="border border-line bg-gradient-to-b from-royal/40 via-surface/80 to-bg p-4 sm:p-8 lg:p-10 shadow-royal">
              <h3 className="text-[20px] sm:text-[22px] font-normal tracking-tight text-cream">
                Consultation Request Form
              </h3>
              <p className="mt-1 text-[12px] sm:text-[13px] text-muted">
                Fields marked with <span className="text-gold">*</span> are required.
              </p>

              <form onSubmit={submit} noValidate className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
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
                      Phone Number <span className="text-gold">*</span>
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
                </div>

                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  {/* Treatment */}
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

                  {/* Location Selection */}
                  <div className="w-full">
                    <label className="block text-[13px] font-medium text-cream">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-gold" /> Consultation Location
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
                                : "border-line bg-surface/60 text-cream/90 hover:border-gold/50"
                            }`}
                          >
                            <span className="truncate">{loc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Date Picker Chips */}
                <fieldset className="w-full" aria-describedby={errors.date ? `${uid}-date-err` : undefined}>
                  <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    <CalendarDays size={14} className="text-gold" /> Preferred Appointment Date <span className="text-gold">*</span>
                  </legend>
                  <div className="mt-2 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {days.map((d) => {
                      const on = form.date === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("date", d.iso)}
                          className={`flex h-[64px] w-[54px] shrink-0 snap-start flex-col items-center justify-center rounded-sm border transition-colors ${
                            on
                              ? "border-gold bg-gold text-[#26082F] font-semibold shadow-sm"
                              : "border-line bg-surface/60 text-cream hover:border-gold/50"
                          }`}
                        >
                          <span className={`text-[10px] font-medium ${on ? "text-[#26082F]" : "text-gold-champagne"}`}>
                            {d.dow}
                          </span>
                          <span className="text-[18px] font-medium leading-none my-0.5">{d.day}</span>
                          <span className={`text-[10px] ${on ? "text-[#26082F]" : "text-muted"}`}>
                            {d.mon}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-muted">
                    <span className="shrink-0 text-cream/80">Or pick date:</span>
                    <input
                      {...aria("date")}
                      className={`${field} !mt-0 w-full flex-1 [color-scheme:dark]`}
                      type="date"
                      min={todayISO()}
                      value={form.date}
                      onChange={set("date")}
                    />
                  </div>
                  {err("date")}
                </fieldset>

                {/* Time Slot Chips */}
                <fieldset className="w-full" aria-describedby={errors.time ? `${uid}-time-err` : undefined}>
                  <legend className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    <Clock size={14} className="text-gold" /> Preferred Time Slot <span className="text-gold">*</span>
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {SLOTS.map((t) => {
                      const on = form.time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick("time", t)}
                          className={`h-10 rounded-sm border px-1 text-[12px] sm:text-[13px] font-medium transition-colors text-center ${
                            on
                              ? "border-gold bg-gold text-[#26082F] font-semibold shadow-sm"
                              : "border-line bg-surface/60 text-cream hover:border-gold/50"
                          }`}
                        >
                          {slotLabel(t)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-muted">
                    <span className="shrink-0 text-cream/80">Or custom time:</span>
                    <input
                      {...aria("time")}
                      className={`${field} !mt-0 w-full flex-1 [color-scheme:dark]`}
                      type="time"
                      step={900}
                      value={form.time}
                      onChange={set("time")}
                    />
                  </div>
                  {err("time")}
                </fieldset>

                {/* Optional Message */}
                <div className="w-full">
                  <label htmlFor={`${uid}-notes`} className="block text-[13px] font-medium text-cream">
                    Optional Message / Specific Questions
                  </label>
                  <textarea
                    {...aria("notes")}
                    className={`${field} min-h-[72px] resize-y`}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Tell us about your dental needs or preferred doctor consultation time..."
                    maxLength={500}
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary h-13 sm:h-14 w-full text-[15px] sm:text-[16px] flex items-center justify-center gap-2">
                    <MessageCircle size={19} aria-hidden /> Book on WhatsApp
                  </button>
                  <p className="mt-3 text-center text-[11px] sm:text-[12px] text-muted">
                    {sent
                      ? "WhatsApp opened! Send the prepared message to confirm your appointment."
                      : "Generates your formatted appointment request to https://wa.me/919562980890"}
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

