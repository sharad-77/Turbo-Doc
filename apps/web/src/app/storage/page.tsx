import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StorageView } from '@/features/storage';

export const metadata: Metadata = {
  title: 'Storage & Files - Turbo-Doc',
  description: 'View, search, and manage your processed documents and images.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <StorageView />
    </ProtectedRoute>
  );
}
