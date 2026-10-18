import type { Metadata } from 'next';
import { SignInView } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In - Turbo-Doc',
  description: 'Sign in to your Turbo-Doc account.',
};

export default function Page() {
  return <SignInView />;
}
