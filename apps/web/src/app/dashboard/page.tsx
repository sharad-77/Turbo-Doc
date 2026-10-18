import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Turbo-Doc',
  description: 'Manage your files, conversions, and storage on Turbo-Doc.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
