'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Storage from '@/views/Storage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Storage />
    </ProtectedRoute>
  );
}
