import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      ignoreGlobalError?: boolean;
      ignoreGlobalLoader?: boolean;
      errorMessage?: string;
    };
    mutationMeta: {
      ignoreGlobalError?: boolean;
      ignoreGlobalLoader?: boolean;
      errorMessage?: string;
      successMessage?: string;
      invalidates?: readonly (readonly unknown[])[];
    };
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.ignoreGlobalError) return;
      // Note: Most Axios errors are already toasted via api-client interceptor
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.ignoreGlobalError) return;
      if (mutation.meta?.errorMessage) {
        toast.error(mutation.meta.errorMessage);
      }
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
      if (mutation.meta?.invalidates) {
        for (const queryKey of mutation.meta.invalidates) {
          void queryClient.invalidateQueries({ queryKey });
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
