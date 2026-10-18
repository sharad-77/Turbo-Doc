import type { Metadata } from 'next';
import { CancellationPolicyView } from '@/features/legal';

export const metadata: Metadata = {
  title: 'Cancellation Policy - Turbo-Doc',
  description: 'Learn about our transparent cancellation process and subscription terms.',
};

export default function Page() {
  return <CancellationPolicyView />;
}
