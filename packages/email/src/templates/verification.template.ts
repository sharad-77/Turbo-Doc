import { EMAIL_THEME } from '../constants/index.js';
import { renderBaseTemplate } from './base.template.js';

export interface VerificationEmailProps {
  name?: string;
  url: string;
}

export function buildVerificationEmailTemplate({
  name,
  url,
}: VerificationEmailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const { colors, typography, layout, branding } = EMAIL_THEME;
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const subject = `Verify your email address - ${branding.appName}`;
  const previewText = `Please confirm your email address to get started with ${branding.appName}.`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: ${typography.titleSize}; font-weight: 700; color: ${colors.textPrimary}; letter-spacing: -0.5px;">
      Verify your email address
    </h1>
    <p style="margin: 0 0 16px 0; font-size: ${typography.bodySize}; color: ${colors.textSecondary};">
      ${greeting}
    </p>
    <p style="margin: 0 0 24px 0; font-size: ${typography.bodySize}; color: ${colors.textSecondary};">
      Thanks for signing up for <strong>${branding.appName}</strong>. Please confirm your email address to activate your account and start using our services.
    </p>
    <div style="margin: 32px 0; text-align: left;">
      <a href="${url}" target="_blank" style="background-color: ${colors.primary}; color: ${colors.buttonText}; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: ${layout.buttonBorderRadius}; display: inline-block;">
        Verify Email Address
      </a>
    </div>
    <p style="margin: 24px 0 8px 0; font-size: ${typography.smallSize}; color: ${colors.textMuted};">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0 0 24px 0; font-size: ${typography.smallSize}; word-break: break-all; color: ${colors.primary};">
      <a href="${url}" style="color: ${colors.primary}; text-decoration: underline;">${url}</a>
    </p>
    <div style="padding-top: 16px; border-top: 1px solid ${colors.borderColor};">
      <p style="margin: 0; font-size: ${typography.smallSize}; color: ${colors.textMuted};">
        If you did not sign up for ${branding.appName}, you can safely disregard this email.
      </p>
    </div>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    contentHtml,
  });

  const text = `${greeting}\n\nThanks for signing up for ${branding.appName}. Please verify your email address by opening the following link in your browser:\n\n${url}\n\nIf you did not sign up for ${branding.appName}, please disregard this email.`;

  return { subject, html, text };
}
