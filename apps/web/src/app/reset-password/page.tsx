import type { Metadata } from 'next';
import { ResetPasswordView } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Reset Password - Turbo-Doc',
  description: 'Set a new password for your Turbo-Doc account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
