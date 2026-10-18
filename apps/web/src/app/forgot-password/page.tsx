import type { Metadata } from 'next';
import { ForgotPasswordView } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Forgot Password - Turbo-Doc',
  description: 'Reset your Turbo-Doc password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
