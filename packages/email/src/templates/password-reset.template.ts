import { EMAIL_THEME } from '../constants/index.js';
import { renderBaseTemplate } from './base.template.js';

export interface PasswordResetEmailProps {
  name?: string;
  url: string;
}

export function buildPasswordResetEmailTemplate({
  name,
  url,
}: PasswordResetEmailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const { colors, typography, layout, branding } = EMAIL_THEME;
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const subject = `Reset your password - ${branding.appName}`;
  const previewText = `Reset the password for your ${branding.appName} account.`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: ${typography.titleSize}; font-weight: 700; color: ${colors.textPrimary}; letter-spacing: -0.5px;">
      Reset your password
    </h1>
    <p style="margin: 0 0 16px 0; font-size: ${typography.bodySize}; color: ${colors.textSecondary};">
      ${greeting}
    </p>
    <p style="margin: 0 0 24px 0; font-size: ${typography.bodySize}; color: ${colors.textSecondary};">
      We received a request to reset the password associated with your <strong>${branding.appName}</strong> account. Click the button below to set a new password:
    </p>
    <div style="margin: 32px 0; text-align: left;">
      <a href="${url}" target="_blank" style="background-color: ${colors.primary}; color: ${colors.buttonText}; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: ${layout.buttonBorderRadius}; display: inline-block;">
        Reset Password
      </a>
    </div>
    <div style="background-color: ${colors.warningBackground}; color: ${colors.warningText}; padding: 12px 16px; border-radius: ${layout.buttonBorderRadius}; font-size: ${typography.smallSize}; margin: 24px 0;">
      <strong>Note:</strong> This link is valid for 1 hour. Once expired, you will need to request a new password reset.
    </div>
    <p style="margin: 24px 0 8px 0; font-size: ${typography.smallSize}; color: ${colors.textMuted};">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0 0 24px 0; font-size: ${typography.smallSize}; word-break: break-all; color: ${colors.primary};">
      <a href="${url}" style="color: ${colors.primary}; text-decoration: underline;">${url}</a>
    </p>
    <div style="padding-top: 16px; border-top: 1px solid ${colors.borderColor};">
      <p style="margin: 0; font-size: ${typography.smallSize}; color: ${colors.textMuted};">
        If you did not make this request, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    contentHtml,
  });

  const text = `${greeting}\n\nWe received a request to reset your ${branding.appName} password. Please open the link below to set a new password:\n\n${url}\n\nThis link is valid for 1 hour.\n\nIf you did not request this change, please ignore this email.`;

  return { subject, html, text };
}
