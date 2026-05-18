import { Resend } from 'resend';
import { config } from '../config/env';

let resend: Resend | null = null;

if (config.resendApiKey) {
  resend = new Resend(config.resendApiKey);
}

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  console.log('RESEND API KEY SET:', Boolean(config.resendApiKey));
  console.log('RESEND FROM:', config.resendFrom);
  console.log('Recipient:', options.to);

  if (!config.resendApiKey) {
    throw new Error('Resend email service is not configured. Set RESEND_API_KEY and restart the server.');
  }

  if (!config.resendApiKey.startsWith('re_')) {
    throw new Error('Resend API key appears invalid. It should start with re_.');
  }

  if (!config.resendFrom || !config.resendFrom.includes('@')) {
    throw new Error('Resend from address is invalid or missing. Set RESEND_FROM to a verified email address.');
  }

  if (!options.to || !options.to.includes('@')) {
    throw new Error(`Invalid recipient email: ${options.to}`);
  }

  const response = (await resend!.emails.send({
    from: config.resendFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })) as any;

  console.log('Resend response:', response);

  if (response?.error) {
    const message = typeof response.error === 'string'
      ? response.error
      : (response.error as any).message || JSON.stringify(response.error);
    throw new Error(`Resend failed: ${message}`);
  }

  if (!response?.data || (response.data as any).id == null) {
    throw new Error(`Resend did not return a valid message id: ${JSON.stringify(response)}`);
  }

  return response;
};

export const sendApplicationEmails = async (payload: {
  applicantEmail: string;
  applicantName: string;
  applicationId: string;
  phone: string;
  college: string;
  course: string;
  yearOfStudy: string;
  skills: string[];
  whyJoin2CaRvN: string;
  availability: string;
  goals: string;
}) => {
  const applicantHtml = `
    <h1>Application Received</h1>
    <p>Hi ${payload.applicantName},</p>
    <p>Thank you for submitting your application. We have received it and will review it within 24 hours.</p>
    <ul>
      <li><strong>Application ID:</strong> ${payload.applicationId}</li>
      <li><strong>Phone:</strong> ${payload.phone}</li>
      <li><strong>College:</strong> ${payload.college}</li>
      <li><strong>Course:</strong> ${payload.course}</li>
      <li><strong>Year of Study:</strong> ${payload.yearOfStudy}</li>
      <li><strong>Skills:</strong> ${payload.skills.join(', ') || 'None'}</li>
      <li><strong>Availability:</strong> ${payload.availability}</li>
    </ul>
    <p>We will be in touch soon.</p>
  `;

  const adminHtml = `
    <h1>New Application Submitted</h1>
    <p>A new application has been submitted by ${payload.applicantName}.</p>
    <ul>
      <li><strong>Applicant Email:</strong> ${payload.applicantEmail}</li>
      <li><strong>Application ID:</strong> ${payload.applicationId}</li>
      <li><strong>Phone:</strong> ${payload.phone}</li>
      <li><strong>College:</strong> ${payload.college}</li>
      <li><strong>Course:</strong> ${payload.course}</li>
      <li><strong>Year of Study:</strong> ${payload.yearOfStudy}</li>
      <li><strong>Skills:</strong> ${payload.skills.join(', ') || 'None'}</li>
      <li><strong>Availability:</strong> ${payload.availability}</li>
      <li><strong>Goals:</strong> ${payload.goals}</li>
      <li><strong>Why Join:</strong> ${payload.whyJoin2CaRvN}</li>
    </ul>
  `;

  const results = await Promise.allSettled([
    sendEmail({
      to: payload.applicantEmail,
      subject: 'Your application has been received',
      html: applicantHtml,
    }),
    sendEmail({
      to: config.adminNotificationEmail,
      subject: 'New application submitted',
      html: adminHtml,
    }),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Email sending failed for recipient ${index === 0 ? 'applicant' : 'admin'}:`, result.reason);
    }
  });
};

export const sendOtpEmail = async (recipientEmail: string, otpCode: string) => {
  const html = `
    <h1>Your verification code</h1>
    <p>Use the following code to complete your login:</p>
    <p style="font-size: 24px; font-weight: bold;">${otpCode}</p>
    <p>This code expires in 10 minutes.</p>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: 'Your login verification code',
    html,
    text: `Your login verification code is ${otpCode}. It expires in 10 minutes.`,
  });
};
