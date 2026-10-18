import type { Metadata } from 'next';
import { ConvertView } from '@/features/convert';

export const metadata: Metadata = {
  title: 'Document Conversion - Turbo-Doc',
  description: 'Convert PDF, Word, DOCX, and Text files easily with Turbo-Doc.',
};

export default function Page() {
  return <ConvertView />;
}
