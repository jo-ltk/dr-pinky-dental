import { MessageCircle } from "lucide-react";
import { BookButton } from "./booking";

const steps = [
  {
    n: "01",
    t: "Choose Treatment & Centre",
    d: "Select the dental service you need and your preferred consultation clinic in Ernakulam, Aluva, Kakkanad, or Angamaly.",
  },
  {
    n: "02",
    t: "Send WhatsApp Request",
    d: "Your preferences are prepared in a structured message addressed directly to Dr. Pinky Varghese (+91 95629 80890).",
  },
  {
    n: "03",
    t: "Confirm Your Slot",
    d: "The clinic team checks the schedule and replies promptly on WhatsApp with confirmed timing and pre-appointment details.",
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 border-t border-line" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="label">Effortless Scheduling</p>
            <h2 id="steps-title" className="mt-4 text-[clamp(36px,5vw,72px)] font-light leading-[1] tracking-hero text-cream">
              Three simple steps,<br /><span className="text-gold-champagne">one quick conversation.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-[1.65] text-muted lg:col-span-5">
            No complex portals or lost emails. Booking is handled directly via WhatsApp with clear communication and fast confirmation.
          </p>
        </div>

        <ol className="mt-14 grid border-t border-line md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.n}
              data-reveal
              style={{ ["--d" as string]: i }}
              className={`relative py-10 md:px-8 ${
                i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"
              }`}
            >
              <span className="text-[64px] font-extralight leading-none tracking-hero text-gold-champagne/80 font-mono">
                {s.n}
              </span>
              <h3 className="mt-6 text-[20px] font-normal tracking-tight2 text-cream">
                {s.t}
              </h3>
              <p className="mt-2.5 max-w-[320px] text-[14px] leading-[1.6] text-muted">
                {s.d}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4" data-reveal>
          <BookButton className="btn-primary w-full sm:w-auto">
            <MessageCircle size={18} aria-hidden /> Start on WhatsApp (+91 95629 80890)
          </BookButton>
          <span className="text-[13px] text-muted">
            Average response time: within 1–2 hours during clinic hours.
          </span>
        </div>
      </div>
    </section>
  );
}
