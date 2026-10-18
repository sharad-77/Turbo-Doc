import type { Metadata } from 'next';
import { RefundPolicyView } from '@/features/legal';

export const metadata: Metadata = {
  title: 'Refund Policy - Turbo-Doc',
  description: 'Details on our refund criteria, eligibility, and processing timelines.',
};

export default function Page() {
  return <RefundPolicyView />;
}
