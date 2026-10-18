import type { Metadata } from 'next';
import { VerifyEmailView } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Verify Email - Turbo-Doc',
  description: 'Confirm and verify your Turbo-Doc email address.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}
