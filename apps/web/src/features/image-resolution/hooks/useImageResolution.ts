'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useCompressImageMutation,
  useConvertImageMutation,
  useDownloadFileMutation,
  useFileUploadMutation,
  useResizeImageMutation,
  useUserPlanQuery,
} from '@/api';
import { validateImageFormat } from '@/lib/format-validation';

export interface UploadedImage {
  file: File;
  objectKey?: string;
  jobId?: string;
  status?: 'pending' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  width?: number;
  height?: number;
}

export function useImageResolution() {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [resolution, setResolution] = useState([100]);
  const [outputFormat, setOutputFormat] = useState<
    'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
  >('png');
  const [operationMode, setOperationMode] = useState<'convert' | 'resize' | 'compress'>('convert');
  const [compressionQuality, setCompressionQuality] = useState([80]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userPlan } = useUserPlanQuery();
  const uploadMutation = useFileUploadMutation();
  const convertMutation = useConvertImageMutation();
  const compressMutation = useCompressImageMutation();
  const resizeMutation = useResizeImageMutation();
  const downloadMutation = useDownloadFileMutation();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFormat(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Unsupported image format');
        return;
      }

      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      img.src = imageUrl;

      img.onload = () => {
        setSelectedImage({
          file,
          status: 'pending',
          width: img.width,
          height: img.height,
        });
        URL.revokeObjectURL(imageUrl);
        toast.success('Image loaded - click "Process Image" to start');
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        toast.error('Failed to load image');
      };
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    try {
      let objectKey = selectedImage.objectKey;
      const width = selectedImage.width;
      const height = selectedImage.height;

      if (!objectKey) {
        setSelectedImage({ ...selectedImage, status: 'uploading' });

        const { key: uploadedKey } = await uploadMutation.mutateAsync({
          file: selectedImage.file,
          folder: 'images',
        });

        objectKey = uploadedKey;
        setSelectedImage({ ...selectedImage, objectKey, status: 'queued' });
      }

      if (!objectKey) {
        toast.error('Failed to upload image. Please try again.');
        return;
      }

      const keyWithoutPrefix = objectKey.replace('temporary/', '');
      const originalFormat = selectedImage.file.name.split('.').pop()?.toLowerCase() || '';

      let job;
      if (operationMode === 'compress') {
        job = await compressMutation.mutateAsync({
          key: keyWithoutPrefix,
          quality: compressionQuality[0] ?? 80,
          originalFileName: selectedImage.file.name,
          originalFormat,
          fileSize: selectedImage.file.size,
          width,
          height,
        });
      } else if (operationMode === 'resize') {
        job = await resizeMutation.mutateAsync({
          key: keyWithoutPrefix,
          scalePercent: resolution[0] ?? 100,
          originalFileName: selectedImage.file.name,
          originalFormat,
          fileSize: selectedImage.file.size,
          width,
          height,
        });
      } else {
        job = await convertMutation.mutateAsync({
          key: keyWithoutPrefix,
          format: outputFormat,
          originalFileName: selectedImage.file.name,
          originalFormat,
          fileSize: selectedImage.file.size,
          width,
          height,
        });
      }

      setSelectedImage({
        ...selectedImage,
        objectKey,
        jobId: job.jobId,
        status: 'queued',
        width,
        height,
      });

      toast.success('Processing started');
    } catch {
      setSelectedImage(prev => (prev ? { ...prev, status: 'failed' } : null));
    }
  };

  const handleDownload = async () => {
    if (!selectedImage?.downloadUrl) {
      toast.error('Processed file not available yet');
      return;
    }
    const fileName = selectedImage.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
    await downloadMutation.mutateAsync({ objectKey: selectedImage.downloadUrl, fileName });
  };

  const handleStatusUpdate = (
    file: File,
    status: UploadedImage['status'],
    downloadUrl?: string
  ) => {
    if (selectedImage && selectedImage.file === file) {
      setSelectedImage({
        ...selectedImage,
        status,
        downloadUrl: downloadUrl || selectedImage.downloadUrl,
      });
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
  };

  return {
    state: {
      selectedImage,
      resolution,
      outputFormat,
      operationMode,
      compressionQuality,
      userPlan,
      fileInputRef,
      isProcessing:
        uploadMutation.isPending ||
        convertMutation.isPending ||
        compressMutation.isPending ||
        resizeMutation.isPending,
    },
    actions: {
      setResolution,
      setOutputFormat,
      setOperationMode,
      setCompressionQuality,
      handleImageSelect,
      handleProcess,
      handleDownload,
      handleStatusUpdate,
      handleRemove,
    },
  };
}
