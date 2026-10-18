import { EMAIL_THEME } from '../constants/index.js';

export interface BaseTemplateProps {
  title: string;
  previewText: string;
  contentHtml: string;
}

export function renderBaseTemplate({
  title,
  previewText,
  contentHtml,
}: BaseTemplateProps): string {
  const { colors, typography, layout, branding } = EMAIL_THEME;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.background}; font-family: ${typography.fontFamily}; color: ${colors.textPrimary}; -webkit-font-smoothing: antialiased; line-height: ${typography.lineHeight};">
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: ${colors.background};">
    ${previewText}
  </div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.background}; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${layout.maxWidth}; background-color: ${colors.cardBackground}; border-radius: ${layout.cardBorderRadius}; border: 1px solid ${colors.borderColor}; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid ${colors.borderColor}; text-align: left;">
              <span style="font-size: 20px; font-weight: 700; color: ${colors.primary}; letter-spacing: -0.5px;">
                ${branding.appName}
              </span>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 40px;">
              ${contentHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; background-color: ${colors.background}; border-top: 1px solid ${colors.borderColor}; text-align: center; font-size: ${typography.smallSize}; color: ${colors.textMuted};">
              <p style="margin: 0 0 8px 0;">
                &copy; ${branding.copyrightYear} ${branding.companyName}. All rights reserved.
              </p>
              <p style="margin: 0;">
                If you have questions, contact us at <a href="mailto:${branding.supportEmail}" style="color: ${colors.primary}; text-decoration: underline;">${branding.supportEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
