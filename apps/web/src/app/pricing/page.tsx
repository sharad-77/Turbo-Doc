import type { Metadata } from 'next';
import { PricingView } from '@/features/pricing';

export const metadata: Metadata = {
  title: 'Pricing Plans - Turbo-Doc',
  description: 'Transparent, simple pricing for document and image processing with Turbo-Doc.',
};

export default function Page() {
  return <PricingView />;
}
