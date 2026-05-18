import { Certification } from '../models/Certification';
import { v4 as uuidv4 } from 'uuid';
import generateCertificatePDF from '../utils/pdfGenerator';
import { logger } from '../utils/logger';

export async function createAndIssueCertificate({
  studentId,
  title,
  description,
  issuedBy,
  category,
  skillLevel,
}: {
  studentId: string;
  title: string;
  description?: string;
  issuedBy: string;
  category?: string;
  skillLevel?: string;
}) {
  const certificateId = uuidv4();

  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-certificate/${certificateId}`;

  try {
    const pdf = await generateCertificatePDF({
      studentName: 'Student',
      title,
      issuedBy,
      certificateId,
      verifyUrl,
    });

    const cert = await Certification.create({
      title,
      description,
      issuedBy,
      issueDate: new Date(),
      certificateId,
      category,
      skillLevel,
      assetUrl: pdf.secure_url,
      studentId,
    });

    return cert;
  } catch (e) {
    logger.error('Failed to generate certificate PDF', e);
    throw e;
  }
}

export async function getCertificateById(certificateId: string) {
  return Certification.findOne({ certificateId }).lean();
}
