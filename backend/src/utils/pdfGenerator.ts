import PDFDocument from 'pdfkit';
import stream from 'stream';
import qrcode from 'qrcode';
import cloudinary from './cloudinary';

export async function generateCertificatePDF({
  studentName,
  title,
  issuedBy,
  certificateId,
  verifyUrl,
}: {
  studentName: string;
  title: string;
  issuedBy: string;
  certificateId: string;
  verifyUrl: string;
}): Promise<{ secure_url: string; public_id: string }> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Convert PDF stream to buffer
  const passThrough = new stream.PassThrough();
  doc.pipe(passThrough);

  // Add a simple modern certificate design
  doc.fillColor('#333');
  doc.fontSize(24).text('Certificate of Achievement', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(14).text(`Presented to: ${studentName}`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).text(`Issued by: ${issuedBy}`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(10).text(`Certificate ID: ${certificateId}`, { align: 'center' });

  // Generate QR code for verification
  const qrDataUrl = await qrcode.toDataURL(verifyUrl);
  const qrImageBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(qrImageBase64, 'base64');

  // Place QR code bottom-right
  const qrX = doc.page.width - 150;
  const qrY = doc.page.height - 200;
  doc.image(qrBuffer, qrX, qrY, { width: 100 });

  doc.end();

  // Upload to Cloudinary as raw file (pdf)
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'certificates', public_id: `cert-${certificateId}` },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    passThrough.pipe(uploadStream);
  });
}

export default generateCertificatePDF;
