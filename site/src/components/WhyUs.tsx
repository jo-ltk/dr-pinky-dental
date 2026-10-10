import { Compass, HeartHandshake, MessagesSquare, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

const points = [
  {
    icon: Compass,
    title: "Specialist Prosthodontic Guidance",
    text: "Led by Dr. Pinky Varghese (MDS), consultations focus on the deep structural relationship between bite mechanics, jaw alignment, and natural tooth aesthetics.",
  },
  {
    icon: ScanLine,
    title: "Modern Implant & Smile Tech",
    text: "Advanced diagnostic protocols, 3D implant positioning, and digital smile previews to plan predictable, permanent dental restorations.",
  },
  {
    icon: HeartHandshake,
    title: "Gentle, Patient-Centred Care",
    text: "Unhurried appointments, comprehensive explanations, and gentle clinical handling designed to make every visit calm and reassuring.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Aesthetic Craftsmanship",
    text: "No generic templates. Every porcelain crown, veneer, and aligner plan is uniquely sculpted to enhance your unique facial harmony.",
  },
  {
    icon: MessagesSquare,
    title: "Direct WhatsApp Communication",
    text: "Effortless scheduling directly with the clinic team on +91 95629 80890 without confusing phone queues or app downloads.",
  },
  {
    icon: ShieldCheck,
    title: "4 Prime Kerala Locations",
    text: "Conveniently accessible for consultations and follow-up reviews across Ernakulam, Aluva, Kakkanad, and Angamaly.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="relative border-y border-line bg-surface/50 py-24 sm:py-32" aria-labelledby="why-title">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="label">Why Choose Us</p>
          <h2 id="why-title" className="mt-4 text-[clamp(36px,4vw,60px)] font-light leading-[1] tracking-hero text-cream">
            Dentistry that feels<br />
            <span className="text-gold-champagne">considered & precise.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.65] text-muted">
            Combining postgraduate prosthodontic mastery with an artist’s eye for smile harmony, Dr. Pinky Varghese provides personalized restorative treatments built to last.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:col-span-8 gap-px bg-line border border-line">
          {points.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              data-reveal
              style={{ ["--d" as string]: i % 3 }}
              className="group bg-surface/90 p-7 sm:p-8 transition-colors duration-300 hover:bg-royal/50"
            >
              <span className="grid h-12 w-12 place-items-center border border-line-strong text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold/15 group-hover:text-gold-champagne">
                <Icon size={20} strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-6 text-[19px] font-normal tracking-tight2 text-cream">
                {title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
