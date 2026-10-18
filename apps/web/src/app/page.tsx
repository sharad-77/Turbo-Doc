import type { Metadata } from 'next';
import { LandingView } from '@/features/landing';

export const metadata: Metadata = {
  title: 'Turbo-Doc - Fast & Secure File Conversion',
  description: 'Convert, merge, and split documents and images in seconds with Turbo-Doc.',
};

export default function Page() {
  return <LandingView />;
}
