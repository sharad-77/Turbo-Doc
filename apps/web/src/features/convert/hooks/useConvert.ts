'use client';

import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useConvertDocumentMutation,
  useDownloadFileMutation,
  useFileUploadMutation,
  useMergePdfsMutation,
  useSplitPdfMutation,
  useUserPlanQuery,
} from '@/api';
import { validateDocumentFormat } from '@/lib/format-validation';

export type OperationMode = 'convert' | 'merge' | 'split';

export interface UploadedFile {
  file: File;
  objectKey?: string;
  jobId?: string;
  status?: 'pending' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}

export function useConvert() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx' | 'txt' | 'doc'>('pdf');
  const [operationMode, setOperationMode] = useState<OperationMode>('convert');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitRange, setSplitRange] = useState({ startPage: '', endPage: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userPlan } = useUserPlanQuery();
  const uploadMutation = useFileUploadMutation();
  const convertMutation = useConvertDocumentMutation();
  const mergeMutation = useMergePdfsMutation();
  const splitMutation = useSplitPdfMutation();
  const downloadMutation = useDownloadFileMutation();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    for (const file of fileList) {
      const validation = validateDocumentFormat(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Unsupported file format');
        continue;
      }

      if (operationMode === 'merge' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast.error(`${file.name}: Only PDF files can be merged`);
        continue;
      }

      if (operationMode === 'split') {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          toast.error('Only PDF files can be split');
          continue;
        }
        if (files.length > 0) {
          toast.error('Only one file allowed for split operation');
          continue;
        }
      }

      const uploadedFile: UploadedFile = { file, status: 'pending' };
      setFiles(prev => [...prev, uploadedFile]);
    }
  };

  const handleStartProcessing = async () => {
    if (files.length === 0) {
      toast.error('Please select files first');
      return;
    }

    if (operationMode === 'merge' && files.length < 2) {
      toast.error('Please select at least 2 PDFs to merge');
      return;
    }

    if (operationMode === 'split' && files.length !== 1) {
      toast.error('Please select exactly 1 PDF to split');
      return;
    }

    setIsProcessing(true);

    try {
      const uploadedFiles: { file: File; key: string }[] = [];

      for (const fileItem of files) {
        if (fileItem.objectKey) {
          uploadedFiles.push({
            file: fileItem.file,
            key: fileItem.objectKey.replace('temporary/', ''),
          });
          continue;
        }

        setFiles(prev =>
          prev.map(f => (f.file === fileItem.file ? { ...f, status: 'uploading' as const } : f))
        );

        try {
          const { objectKey } = await uploadMutation.mutateAsync({
            file: fileItem.file,
            folder: 'temporary',
          });

          const keyWithoutPrefix = objectKey.replace('temporary/', '');
          uploadedFiles.push({ file: fileItem.file, key: keyWithoutPrefix });

          setFiles(prev =>
            prev.map(f =>
              f.file === fileItem.file ? { ...f, objectKey, status: 'queued' as const } : f
            )
          );
        } catch {
          setFiles(prev =>
            prev.map(f => (f.file === fileItem.file ? { ...f, status: 'failed' as const } : f))
          );
          setIsProcessing(false);
          return;
        }
      }

      if (operationMode === 'convert') {
        for (const { file, key } of uploadedFiles) {
          const originalFormat = file.name.split('.').pop()?.toLowerCase() || '';

          try {
            const job = await convertMutation.mutateAsync({
              key,
              targetFormat: outputFormat,
              originalFileName: file.name,
              originalFormat,
              fileSize: file.size,
            });

            setFiles(prev =>
              prev.map(f =>
                f.file === file ? { ...f, jobId: job.jobId, status: 'queued' as const } : f
              )
            );
          } catch {
            setFiles(prev =>
              prev.map(f => (f.file === file ? { ...f, status: 'failed' as const } : f))
            );
          }
        }
      } else if (operationMode === 'merge') {
        const keys = uploadedFiles.map(uf => uf.key);
        const totalSize = uploadedFiles.reduce((sum, uf) => sum + uf.file.size, 0);
        const mergedFileName = `merged-${Date.now()}.pdf`;

        try {
          const job = await mergeMutation.mutateAsync({
            keys,
            originalFileName: mergedFileName,
            originalFormat: 'pdf',
            fileSize: totalSize,
          });

          const mergedFile = new File([], mergedFileName, { type: 'application/pdf' });
          setFiles([
            {
              file: mergedFile,
              jobId: job.jobId,
              status: 'queued' as const,
            },
          ]);
        } catch {
          setFiles(prev => prev.map(f => ({ ...f, status: 'failed' as const })));
        }
      } else if (operationMode === 'split') {
        const { file, key } = uploadedFiles[0];
        const startPage = parseInt(splitRange.startPage, 10) || 1;
        const endPage = parseInt(splitRange.endPage, 10) || 1;
        const baseName = file.name.replace(/\.pdf$/i, '');
        const splitFileName = `${baseName}_pages_${startPage}-${endPage}.pdf`;

        try {
          const job = await splitMutation.mutateAsync({
            key,
            startPage,
            endPage,
            originalFileName: file.name,
            fileSize: file.size,
          });

          const splitFile = new File([], splitFileName, { type: 'application/pdf' });
          setFiles([
            {
              file: splitFile,
              jobId: job.jobId,
              status: 'queued' as const,
            },
          ]);
        } catch {
          setFiles(prev =>
            prev.map(f => (f.file === file ? { ...f, status: 'failed' as const } : f))
          );
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = async (file: UploadedFile) => {
    if (!file.downloadUrl) {
      toast.error('Processed file not available yet');
      return;
    }
    const fileName = file.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
    await downloadMutation.mutateAsync({ objectKey: file.downloadUrl, fileName });
  };

  const handleStatusUpdate = (file: File, status: UploadedFile['status'], downloadUrl?: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.file === file ? { ...f, status, downloadUrl: downloadUrl || f.downloadUrl } : f
      )
    );
  };

  const sortedFiles = useMemo(() => {
    const statusOrder: Record<UploadedFile['status'] & string, number> = {
      processing: 0,
      queued: 1,
      uploading: 2,
      pending: 3,
      completed: 4,
      failed: 5,
    };
    return [...files].sort((a, b) => {
      return (statusOrder[a.status || 'pending'] ?? 3) - (statusOrder[b.status || 'pending'] ?? 3);
    });
  }, [files]);

  return {
    state: {
      files,
      sortedFiles,
      dragActive,
      outputFormat,
      operationMode,
      isProcessing,
      splitRange,
      userPlan,
      fileInputRef,
    },
    actions: {
      setFiles,
      setOutputFormat,
      setOperationMode,
      setSplitRange,
      handleDrag,
      handleDrop,
      handleFileSelect,
      handleStartProcessing,
      removeFile,
      handleDownload,
      handleStatusUpdate,
    },
  };
}
