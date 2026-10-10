import Link from "next/link";
import { clinic } from "@/lib/clinic.config";

export const metadata = { title: `Privacy Policy — ${clinic.fullName}` };

export default function Privacy() {
  return (
    <main className="wrap max-w-3xl py-24 text-[15px] leading-[1.7] text-muted">
      <Link href="/" className="label text-gold-champagne hover:underline">← Back to Home</Link>
      <h1 className="mt-6 text-[44px] font-light tracking-hero text-cream">Privacy Policy</h1>
      <p className="mt-6 text-cream/90">
        This website does not store your confidential health or booking information on external servers. When you click “Book on WhatsApp” or submit an appointment request, your details are structured solely on your local device and transferred directly into the official WhatsApp chat with Dr. Pinky Varghese (+91 95629 80890).
      </p>
      <p className="mt-4">
        No payment details, medical records, or sensitive identifiers are stored in cookies or third-party tracking databases. Any clinical records shared during consultation follow standard medical confidentiality protocols under Dr. Pinky Varghese’s clinical practice.
      </p>
      <p className="mt-6 border-t border-line pt-4 text-[13px] text-muted">
        For inquiries or record requests: <span className="text-cream">{clinic.email}</span> · <span className="text-cream font-mono">{clinic.phoneDisplay}</span>
      </p>
    </main>
  );
}
