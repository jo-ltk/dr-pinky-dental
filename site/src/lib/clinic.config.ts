/**
 * ─────────────────────────────────────────────────────────────
 *  CLINIC CONFIGURATION — Dr. Pinky Varghese Luxury Dental
 * ─────────────────────────────────────────────────────────────
 *  Doctor: Dr. Pinky Varghese, MDS (Prosthodontics)
 *  Title: Consultant Implantologist & Smile Designer
 *  WhatsApp / Phone: +91 95629 80890
 *  Locations: Ernakulam, Aluva, Kakkanad, Angamaly
 */
export const clinic = {
  name: "Dr. Pinky Varghese",
  fullName: "Dr. Pinky Varghese",
  qualification: "MDS",
  specialization: "Prosthodontics",
  title: "Consultant Implantologist & Smile Designer",
  shortName: "Dr. Pinky",
  whatsappNumber: "919562980890",
  phoneDisplay: "+91 95629 80890",
  whatsappUrl: "https://wa.me/919562980890",
  email: "drpinkyvarghese@gmail.com",
  address: {
    line1: "Consultation Centres",
    line2: "Ernakulam · Aluva · Kakkanad · Angamaly",
    city: "Kochi",
    state: "Kerala",
    country: "India",
  },
  locations: [
    {
      id: "ernakulam",
      name: "Ernakulam",
      area: "Marine Drive & MG Road Corridor",
      description: "Advanced implantology consultations and comprehensive smile design clinic.",
      timing: "Mon – Sat: 10:00 AM – 7:00 PM",
    },
    {
      id: "aluva",
      name: "Aluva",
      area: "Town Centre Junction",
      description: "Prosthodontic rehabilitation and restorative consultation center.",
      timing: "Mon – Sat: 10:00 AM – 6:30 PM",
    },
    {
      id: "kakkanad",
      name: "Kakkanad",
      area: "Infopark / Civil Station Area",
      description: "Aesthetic dentistry, whitening, and specialized smile makeovers.",
      timing: "Mon – Sat: 10:30 AM – 7:30 PM",
    },
    {
      id: "angamaly",
      name: "Angamaly",
      area: "Main Road Airport Belt",
      description: "Full-mouth rehabilitation and specialized implant consultations.",
      timing: "Prior Appointment Only",
    },
  ],
  hours: [
    { days: "Monday – Saturday", time: "10:00 AM – 7:00 PM" },
    { days: "Sunday", time: "Prior Appointment Only" },
  ],
  siteUrl: "https://drpinkydental.com",
} as const;

export type Treatment = {
  id: string;
  name: string;
  short: string;
  description: string;
  benefits: string[];
};

export const treatments: Treatment[] = [
  {
    id: "implants",
    name: "Dental Implants",
    short: "Implants",
    description: "Fixed, biocompatible titanium and ceramic root replacements planned with 3D precision to restore chewing function and natural facial aesthetics permanently.",
    benefits: ["Permanent tooth replacement", "Prevents bone loss", "Natural bite stability"],
  },
  {
    id: "smile-design",
    name: "Smile Design",
    short: "Smile Design",
    description: "Architectural smile sculpting harmonizing facial proportions, lip aesthetics, and tooth contours using cutting-edge digital prosthodontic protocols.",
    benefits: ["Custom aesthetic planning", "Facial symmetry balance", "Minimally invasive options"],
  },
  {
    id: "cosmetic",
    name: "Cosmetic Dentistry",
    short: "Cosmetic",
    description: "Ultra-thin porcelain veneers, composite laminates, and diastema closure crafted for flawless texture, light translucency, and lifelike natural beauty.",
    benefits: ["Ultra-thin veneers", "Composite contouring", "Gap correction"],
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    short: "Whitening",
    description: "In-office laser-assisted and enamel-safe whitening protocols for significant, radiant shade improvements without prolonged sensitivity.",
    benefits: ["Multiple shades lighter", "Enamel-safe formulation", "Instant lasting brilliance"],
  },
  {
    id: "root-canal",
    name: "Root Canal Treatment",
    short: "Root Canal",
    description: "Precision rotary endodontic therapy performed with gentle microscopic accuracy to relieve infection and preserve your natural tooth root.",
    benefits: ["Gentle rotary tech", "Preserves natural tooth", "Immediate pain relief"],
  },
  {
    id: "general",
    name: "General Dental Care",
    short: "General Care",
    description: "Comprehensive preventive dentistry, ultrasonic scaling, digital restorations, and ongoing oral wellness maintenance for patients of all ages.",
    benefits: ["Preventive deep scaling", "Tooth-colored fillings", "Routine oral exams"],
  },
];

/** Doctor credentials and profile */
export const doctorProfile = {
  name: "Dr. Pinky Varghese",
  qualifications: "MDS",
  specialization: "Prosthodontics",
  role: "Consultant Implantologist & Smile Designer",
  bio: "Dedicated to helping patients achieve healthier smiles through personalized dental care, implant treatment, and smile design.",
  experienceSummary: "Dedicated to helping patients achieve healthier smiles through personalized dental care, implant treatment, and smile design.",
  photo: "/dr-pinky.png",
  locations: ["Ernakulam", "Aluva", "Kakkanad", "Angamaly"],
  pillars: [
    { title: "MDS in Prosthodontics", desc: "Specialist post-graduate training in replacement, reconstruction, and cosmetic restoration of teeth." },
    { title: "Consultant Implantologist", desc: "Expertise in single-tooth, multiple, and immediate load implant systems." },
    { title: "Smile Designer", desc: "Personalized digital smile mockups aligning facial beauty with functional bite mechanics." },
    { title: "Multi-Center Access", desc: "Convenient consultation appointments across 4 prime Kerala locations." },
  ],
};

/** Team array for any multi-specialist reference */
export const team = [
  {
    name: "Dr. Pinky Varghese",
    role: "Consultant Implantologist & Smile Designer",
    qualification: "MDS (Prosthodontics)",
    bio: "Dedicated to helping patients achieve healthier smiles through personalized dental care, implant treatment, and smile design.",
    photo: "/dr-pinky.png",
  },
];

