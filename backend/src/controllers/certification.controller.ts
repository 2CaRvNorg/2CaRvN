import { Request, Response, NextFunction } from 'express';
import { createAndIssueCertificate, getCertificateById } from '../services/certification.service';
import { successResponse, errorResponse } from '../utils/responseFormat';

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, title, description, category, skillLevel } = req.body;
    const issuedBy = (req.user as any)?.name || 'Admin';

    const cert = await createAndIssueCertificate({ studentId: String(studentId), title, description, category, skillLevel, issuedBy });

    res.status(201).json(successResponse(cert, 'Certificate issued'));
  } catch (e) {
    next(e);
  }
};

export const verifyCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = req.params.certificateId;
    const certificateId = Array.isArray(rawId) ? rawId[0] : String(rawId || '');
    const cert = await getCertificateById(certificateId);
    if (!cert) return res.status(404).json(errorResponse('Certificate not found'));
    res.status(200).json(successResponse(cert, 'Certificate valid'));
  } catch (e) {
    next(e);
  }
};
