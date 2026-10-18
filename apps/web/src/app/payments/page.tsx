import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PaymentsView } from '@/features/payments';

export const metadata: Metadata = {
  title: 'Checkout - Turbo-Doc',
  description: 'Complete your subscription upgrade securely with Razorpay.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <PaymentsView />
    </ProtectedRoute>
  );
}
