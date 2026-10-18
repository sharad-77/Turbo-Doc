import type { Metadata } from 'next';
import { PrivacyPolicyView } from '@/features/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy - Turbo-Doc',
  description: 'Understand how we protect, store, and process your personal and document data.',
};

export default function Page() {
  return <PrivacyPolicyView />;
}
