import { clinic } from "./clinic.config";

export type BookingDetails = {
  name?: string;
  phone?: string;
  treatment?: string;
  location?: string;
  date?: string; // yyyy-mm-dd
  time?: string; // HH:MM
  notes?: string;
};

/** Click-to-chat URL for the clinic's WhatsApp, with the message safely encoded. */
export function whatsappUrl(message: string): string {
  // strip spaces, "+", dashes and brackets; digits only
  const number = clinic.whatsappNumber.replace(/[\s+\-()]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Short enquiry used by plain CTAs (header, hero, service cards, locations…). */
export function enquiryMessage(treatment?: string, location?: string): string {
  if (treatment && location) {
    return `Hello Dr. Pinky Varghese, I would like to enquire about ${treatment} at your ${location} consultation center. Please let me know the available appointment slots. Thank you.`;
  }
  if (treatment) {
    return `Hello Dr. Pinky Varghese, I would like to enquire about ${treatment}. Please let me know the available appointment slots. Thank you.`;
  }
  if (location) {
    return `Hello Dr. Pinky Varghese, I would like to book a consultation at your ${location} clinic. Please let me know the available appointment slots. Thank you.`;
  }
  return `Hello Dr. Pinky Varghese, I would like to book a dental consultation appointment. Please share available dates and timings. Thank you.`;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(hhmm?: string) {
  if (!hhmm) return "";
  const [h, min] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(min ?? 0).padStart(2, "0")} ${suffix}`;
}

/** The full, formatted appointment request built from the booking form. */
export function bookingMessage(b: BookingDetails): string {
  const lines = [
    "Hello Dr. Pinky Varghese,",
    "I would like to request an appointment for dental consultation.",
    "",
  ];
  if (b.name?.trim()) lines.push(`• Patient Name: ${b.name.trim()}`);
  if (b.phone?.trim()) lines.push(`• Phone Number: ${b.phone.trim()}`);
  if (b.treatment?.trim()) lines.push(`• Preferred Treatment: ${b.treatment.trim()}`);
  if (b.location?.trim()) lines.push(`• Consultation Location: ${b.location.trim()}`);
  if (b.date) lines.push(`• Preferred Date: ${formatDate(b.date)}`);
  if (b.time) lines.push(`• Preferred Time: ${formatTime(b.time)}`);
  if (b.notes?.trim()) lines.push(`• Message / Notes: ${b.notes.trim()}`);
  lines.push(
    "",
    "Kindly let me know the next available slot for confirmation. Thank you!"
  );
  return lines.join("\n");
}

/** Opens WhatsApp (app on mobile, web on desktop) in a new tab. */
export function openWhatsApp(message: string) {
  const url = whatsappUrl(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url; // popup blocked → same tab
}
