export * from './types';
export * from './query-keys';
export * from './queries/index';
export * from './mutations/index';

// Compatibility aliases
export { useDashboardStatsQuery as useDashboardStats } from './queries/useDashboardQueries';
export { useFilesQuery as useRecentFilesQuery } from './queries/useFileQueries';
export { useFilesQuery as useUserFilesQuery } from './queries/useFileQueries';
export { useConvertFileMutation as useConvertDocumentMutation } from './mutations/useConvertMutations';
export { useProcessImageMutation as useConvertImageMutation } from './mutations/useImageMutations';
export { useUploadFileMutation as useFileUploadMutation } from './mutations/useUploadMutations';
export { useUploadFileMutation as useFileUpload } from './mutations/useUploadMutations';
export { useJobStatusQuery as useJobStatus } from './queries/useConvertQueries';
