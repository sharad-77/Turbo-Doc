import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileView } from '@/features/profile';

export const metadata: Metadata = {
  title: 'Profile - Turbo-Doc',
  description: 'Manage your account profile and subscription plan.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}
