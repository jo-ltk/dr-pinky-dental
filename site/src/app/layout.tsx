import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "./globals.css";
import { clinic } from "@/lib/clinic.config";

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  title: `${clinic.fullName}, MDS — Consultant Implantologist & Smile Designer`,
  description:
    "Specialist Prosthodontist Dr. Pinky Varghese (MDS). Advanced dental implants, custom smile design, cosmetic dentistry, and dental restorations across Ernakulam, Aluva, Kakkanad, and Angamaly. Book appointments on WhatsApp: +91 95629 80890.",
  keywords: [
    "Dr. Pinky Varghese",
    "MDS Prosthodontics",
    "Consultant Implantologist",
    "Smile Designer Kochi",
    "Dental Implants Ernakulam",
    "Dentist Aluva",
    "Dental Clinic Kakkanad",
    "Dentist Angamaly",
    "Cosmetic Dentistry",
    "Teeth Whitening",
  ],
  openGraph: {
    title: `${clinic.fullName} — Modern Care for a Perfect Smile`,
    description:
      "Specialist dental implants, bespoke smile designing, and comprehensive prosthodontics in Ernakulam, Aluva, Kakkanad, and Angamaly. Book directly on WhatsApp.",
    type: "website",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Dr. Pinky Varghese Monogram" }],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#26082F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
