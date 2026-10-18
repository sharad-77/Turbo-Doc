/**
 * Centralized Query Key Factories for TanStack Query
 * Ensures consistent key structures across queries and invalidations.
 */
export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
  plans: {
    all: ['plans'] as const,
    list: () => [...queryKeys.plans.all, 'list'] as const,
    byName: (name: string) => [...queryKeys.plans.all, 'by-name', name] as const,
    userPlan: () => [...queryKeys.plans.all, 'user-plan'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
  },
  files: {
    all: ['files'] as const,
    list: (limit?: number) => [...queryKeys.files.all, 'list', limit ?? 'all'] as const,
  },
  convert: {
    all: ['convert'] as const,
    types: () => [...queryKeys.convert.all, 'types'] as const,
    job: (jobId?: string) => [...queryKeys.convert.all, 'job', jobId ?? ''] as const,
  },
  images: {
    all: ['images'] as const,
    job: (jobId?: string) => [...queryKeys.images.all, 'job', jobId ?? ''] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
