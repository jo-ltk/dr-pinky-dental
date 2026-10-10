import { clinic } from "@/lib/clinic.config";

/**
 * Official Dr. Pinky Luxury Monogram Logo.
 * Preserves the original uploaded artwork without distortion, recoloring or replacement.
 */
export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt={`${clinic.fullName} — ${clinic.title}`}
      className={`${className} object-contain select-none`}
      width={160}
      height={80}
    />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`group inline-flex min-h-[44px] items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
      aria-label={`${clinic.fullName} — Consultant Implantologist & Smile Designer`}
    >
      <LogoMark className="h-10 sm:h-12 w-auto transition-transform duration-500 group-hover:scale-[1.02]" />
      <div className="hidden sm:flex flex-col">
        <span className="text-[16px] font-medium tracking-tight2 text-cream">
          {clinic.fullName}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-champagne">
          {clinic.title}
        </span>
      </div>
    </a>
  );
}
