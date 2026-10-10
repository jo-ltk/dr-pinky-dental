import { MessageCircle } from "lucide-react";
import { team } from "@/lib/clinic.config";
import { BookButton } from "./booking";

function Portrait({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(90%_70%_at_50%_30%,#2b1450,#0b0614)]">
      {src ? (
        <img src={src} alt={`Portrait of ${name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
      ) : (
        // Placeholder until a real portrait is added in clinic.config.ts
        <>
          <svg viewBox="0 0 100 125" className="absolute inset-x-[12%] bottom-0 w-[76%] text-white/[0.08] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" aria-hidden>
            <circle cx="50" cy="46" r="19" fill="currentColor" />
            <path d="M8 125c2-30 18-45 42-45s40 15 42 45z" fill="currentColor" />
          </svg>
          <span className="absolute right-3 top-3 border border-line px-2 py-1 text-[11px] font-medium text-muted">Portrait placeholder</span>
        </>
      )}
      <span className="absolute bottom-0 left-0 bg-black px-4 py-2.5 text-[14px] font-medium text-white">{name}</span>
    </div>
  );
}

export function Team() {
  return (
    <section id="specialists" className="relative py-24 sm:py-32" aria-labelledby="team-title">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <p className="label">Our specialists</p>
            <h2 id="team-title" className="mt-5 text-[clamp(38px,5vw,76px)] font-light leading-[0.98] tracking-hero">
              Choose<br /><span className="text-lavender">a specialist.</span>
            </h2>
          </div>
          <BookButton treatment="Consultation / Not sure yet" className="btn-ghost w-full sm:w-auto">
            <MessageCircle size={17} aria-hidden /> Ask About a Consultation
          </BookButton>
        </div>

        <ul className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {team.map((d, i) => (
            <li key={i} className="group w-[82%] shrink-0 snap-start sm:w-auto" data-reveal style={{ ["--d" as string]: i }}>
              <article>
                <Portrait src={d.photo} name={d.name} />
                <div className="border-x border-b border-line p-5">
                  <p className="text-[12px] font-semibold uppercase tracking-label text-lavender">{d.role}</p>
                  <p className="mt-1.5 text-[13px] text-muted">{d.qualification}</p>
                  <p className="mt-4 text-[14px] leading-[1.6] text-white/80">{d.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
