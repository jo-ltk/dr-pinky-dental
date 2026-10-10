import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "./globals.css";
import { clinic } from "@/lib/clinic.config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://dental-clinic-site-kappa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${clinic.fullName} (MDS) — Consultant Implantologist & Smile Designer`,
    template: `%s | ${clinic.fullName}`,
  },
  description:
    "Specialist Prosthodontist Dr. Pinky Varghese (MDS). Advanced dental implants, custom smile design, cosmetic dentistry & full-mouth rehabilitation in Ernakulam, Aluva, Kakkanad & Angamaly. Book appointments: +91 95629 80890.",
  keywords: [
    "Dr. Pinky Varghese",
    "Dr Pinky Varghese MDS",
    "Prosthodontist Kochi",
    "Consultant Implantologist Ernakulam",
    "Smile Designer Kochi",
    "Dental Implants Ernakulam",
    "Dentist Aluva",
    "Dental Clinic Kakkanad",
    "Dentist Angamaly",
    "Best Dentist Kochi",
  ],
  authors: [{ name: clinic.fullName }],
  creator: clinic.fullName,
  publisher: `${clinic.fullName} Dental`,
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: `${clinic.fullName} (MDS) — Consultant Implantologist & Smile Designer`,
    description:
      "Specialist dental implants, bespoke smile designing, and comprehensive prosthodontics in Ernakulam, Aluva, Kakkanad, and Angamaly. Book directly on WhatsApp: +91 95629 80890.",
    url: siteUrl,
    siteName: `${clinic.fullName} Dental`,
    images: [
      {
        url: "/og-image.jpg",
        width: 800,
        height: 800,
        type: "image/jpeg",
        alt: "Dr. Pinky Varghese Dental Logo",
      },
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Dr. Pinky Varghese Dental Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.fullName} (MDS) — Consultant Implantologist & Smile Designer`,
    description:
      "Specialist dental implants, bespoke smile designing, and comprehensive prosthodontics across Ernakulam, Aluva, Kakkanad, and Angamaly.",
    images: ["/og-banner.jpg"],
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#26082F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ogImageUrl = `${siteUrl}/og-image.jpg`;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Dr. Pinky Varghese Monogram Logo" />
        <link rel="image_src" href={ogImageUrl} />
      </head>
      <body>{children}</body>
    </html>
  );
}
