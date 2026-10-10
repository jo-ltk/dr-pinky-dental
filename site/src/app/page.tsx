import { BookingProvider } from "@/components/booking";
import { BookingSection } from "@/components/BookingSection";
import { DoctorProfile } from "@/components/DoctorProfile";
import { FinalCta } from "@/components/FinalCta";
import { FloatingCta } from "@/components/FloatingCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Locations } from "@/components/Locations";
import { RevealObserver } from "@/components/Reveal";
import { Services } from "@/components/Services";
import { Steps } from "@/components/Steps";
import { TreatmentMap } from "@/components/TreatmentMap";
import { WhyUs } from "@/components/WhyUs";
import { clinic, treatments } from "@/lib/clinic.config";

// Structured data for SEO: only real verified fields
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: clinic.fullName,
  alternateName: "Dr. Pinky Varghese Dental Clinic",
  description: `${clinic.title} — Specialist Prosthodontist (MDS) providing dental implants, smile design, and cosmetic dentistry in Ernakulam, Aluva, Kakkanad, and Angamaly.`,
  url: clinic.siteUrl,
  telephone: clinic.phoneDisplay,
  image: `${clinic.siteUrl}/logo.png`,
  priceRange: "$$",
  medicalSpecialty: "Prosthodontics",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Consultation Centres in Ernakulam, Aluva, Kakkanad, and Angamaly",
    addressLocality: "Kochi",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  availableService: treatments.map((t) => ({
    "@type": "MedicalProcedure",
    name: t.name,
    description: t.description,
  })),
  areaServed: clinic.locations.map((l) => l.name),
};

export default function Page() {
  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main">
        {/* Section 2 & 3: Hero with 3D tooth & implant */}
        <Hero />
        {/* Section 4: Dental services */}
        <Services />
        {/* Interactive Treatment Plan Map */}
        <TreatmentMap />
        {/* Section 5: Doctor profile featuring Dr. Pinky Varghese */}
        <DoctorProfile />
        {/* Section 6: Why choose the clinic */}
        <WhyUs />
        {/* Section 7: Consultation locations: Ernakulam, Aluva, Kakkanad, Angamaly */}
        <Locations />
        {/* Booking steps */}
        <Steps />
        {/* Section 8: Simple appointment booking form */}
        <BookingSection />
        {/* Section 9: Final WhatsApp appointment CTA */}
        <FinalCta />
      </main>
      {/* Section 10: Footer with contact info & editable details */}
      <Footer />
      {/* Floating CTA & Mobile Sticky Bar */}
      <FloatingCta />
      <RevealObserver />
    </BookingProvider>
  );
}
