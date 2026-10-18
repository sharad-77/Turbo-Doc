import type { Metadata } from 'next';
import { ImageResolutionView } from '@/features/image-resolution';

export const metadata: Metadata = {
  title: 'Image Processing - Turbo-Doc',
  description: 'Compress, resize, and convert images to WebP, AVIF, PNG, and JPEG.',
};

export default function Page() {
  return <ImageResolutionView />;
}
