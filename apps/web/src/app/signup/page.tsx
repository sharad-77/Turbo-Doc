import type { Metadata } from 'next';
import { SignUpView } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign Up - Turbo-Doc',
  description: 'Create your free Turbo-Doc account.',
};

export default function Page() {
  return <SignUpView />;
}
