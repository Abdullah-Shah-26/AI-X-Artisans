import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CertificateView } from "./CertificateView";

// Demo certificates for demo products
const demoCertificates = [
  {
    id: "cert-demo-1",
    artworkName: "Handwoven Basket",
    craftTradition: "Basket Weaving",
    certifiedDate: new Date("2024-12-15"),
    heritageStory:
      "This handwoven basket represents centuries of traditional craftsmanship, using natural fibers and geometric patterns unique to our region.",
    image:
      "https://handmadecrafts.simdif.com/images/public/sd_64735c47e5d9c.jpg?no_cache=1685289084",
    qrCode: "demo-qr-1",
    artist: { name: "Lakshmi Devi" },
    product: { id: "demo-1", name: "Handwoven Basket" },
  },
  {
    id: "cert-demo-3",
    artworkName: "Ceramic Tea Set",
    craftTradition: "Ceramic Art",
    certifiedDate: new Date("2024-12-20"),
    heritageStory:
      "This hand-painted ceramic tea set showcases traditional pottery techniques passed down through generations. Each piece is individually crafted and painted with intricate designs inspired by our rich cultural heritage, representing the timeless art of ceramic craftsmanship.",
    image:
      "https://siggyhandmade.com/cdn/shop/products/CeramicTeaSet.jpg?v=1663196891",
    qrCode: "demo-qr-3",
    artist: { name: "Meena Sharma" },
    product: { id: "demo-3", name: "Ceramic Tea Set" },
  },
  {
    id: "cert-demo-6",
    artworkName: "Bamboo Basket Set",
    craftTradition: "Bamboo Craft",
    certifiedDate: new Date("2024-12-25"),
    heritageStory:
      "These handwoven bamboo baskets represent sustainable craftsmanship rooted in traditional techniques. Made from locally sourced bamboo using eco-friendly methods, each basket embodies our commitment to preserving both cultural heritage and environmental sustainability.",
    image:
      "https://www.nicobar.com/cdn/shop/products/1518630607A46A7142_ea3907a7-1284-4616-973b-3aecb49cf199.jpg?v=1710310859",
    qrCode: "demo-qr-6",
    artist: { name: "Gopal Das" },
    product: { id: "demo-6", name: "Bamboo Basket Set" },
  },
  {
    id: "cert-demo-9",
    artworkName: "Handwoven Silk Saree",
    craftTradition: "Silk Weaving",
    certifiedDate: new Date("2024-12-28"),
    heritageStory:
      "This exquisite Banarasi silk saree is a masterpiece woven on traditional pit looms using techniques perfected over centuries. The intricate zari work and traditional motifs represent the pinnacle of Indian textile artistry, with each thread telling a story of heritage spanning generations. This saree embodies the timeless elegance and cultural richness of Varanasi's legendary weaving tradition.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    qrCode: "demo-qr-9",
    artist: { name: "Ramesh Joshi" },
    product: { id: "demo-9", name: "Handwoven Silk Saree" },
  },
];

async function getCertificate(id: string) {
  // Check if it's a demo certificate
  if (id.startsWith("cert-demo-")) {
    return demoCertificates.find((c) => c.id === id) || null;
  }

  return prisma.certificate.findUnique({
    where: { id },
    include: {
      artist: {
        select: { name: true },
      },
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  return <CertificateView certificate={certificate} />;
}
