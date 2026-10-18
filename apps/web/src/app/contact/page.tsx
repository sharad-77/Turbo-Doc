import type { Metadata } from 'next';
import { ContactSupportView } from '@/features/legal';

export const metadata: Metadata = {
  title: 'Contact Support - Turbo-Doc',
  description: 'Have questions or need assistance? Reach out to the Turbo-Doc team.',
};

export default function Page() {
  return <ContactSupportView />;
}
