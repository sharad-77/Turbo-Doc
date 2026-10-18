import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsView } from '@/features/settings';

export const metadata: Metadata = {
  title: 'Account Settings - Turbo-Doc',
  description: 'Update your security, password, and email preferences.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsView />
    </ProtectedRoute>
  );
}
