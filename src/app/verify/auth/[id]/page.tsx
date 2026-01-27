import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CertificateView } from "./CertificateView";

async function getCertificate(id: string) {
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
