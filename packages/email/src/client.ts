import { Resend } from 'resend';
import {
  buildVerificationEmailTemplate,
  buildPasswordResetEmailTemplate,
} from './templates/index.js';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[EmailService] RESEND_API_KEY is not defined in environment variables');
    }
    resendClient = new Resend(apiKey || 'missing_key');
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions) {
  const client = getResendClient();
  const fromAddress =
    from || process.env.EMAIL_FROM || 'Turbo-Doc <onboarding@resend.dev>';
  const recipients = Array.isArray(to) ? to : [to];

  return client.emails.send({
    from: fromAddress,
    to: recipients,
    subject,
    html,
    text,
  });
}

export async function sendVerificationEmail({
  to,
  name,
  url,
}: {
  to: string;
  name?: string;
  url: string;
}) {
  const template = buildVerificationEmailTemplate({ name, url });
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  url,
}: {
  to: string;
  name?: string;
  url: string;
}) {
  const template = buildPasswordResetEmailTemplate({ name, url });
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
