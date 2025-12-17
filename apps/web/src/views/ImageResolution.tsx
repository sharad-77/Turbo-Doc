'use client';

import {
  compressImage,
  convertImage,
  downloadFileFromS3,
  resizeImage,
  useFileUpload,
  useJobStatus,
} from '@/api';
import { getUserPlan } from '@/api/plans';
import { validateImageFormat } from '@/lib/format-validation';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { Download, ImageIcon, Upload, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UploadedImage {
  file: File;
  objectKey?: string;
  jobId?: string;
  status?: 'pending' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  width?: number;
  height?: number;
}

// Image Item Component
const ImageItem = ({
  imageItem,
  onRemove,
  onDownload,
  onStatusUpdate,
}: {
  imageItem: UploadedImage;
  onRemove: () => void;
  onDownload: () => void;
  onStatusUpdate: (file: File, status: UploadedImage['status'], downloadUrl?: string) => void;
}) => {
  const { data: jobStatus } = useJobStatus({
    jobId: imageItem.jobId || '',
    type: 'image',
    enabled: !!imageItem.jobId && imageItem.status !== 'completed' && imageItem.status !== 'failed',
  });

  // Update parent when job status changes (using useEffect to avoid render-time updates)
  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.status === 'completed' && jobStatus.processedFileKey && !imageItem.downloadUrl) {
      onStatusUpdate(imageItem.file, 'completed', jobStatus.processedFileKey);
    } else if (jobStatus.status === 'failed' && imageItem.status !== 'failed') {
      onStatusUpdate(imageItem.file, 'failed');
    } else if (jobStatus.status === 'processing' && imageItem.status !== 'processing') {
      onStatusUpdate(imageItem.file, 'processing');
    }
  }, [jobStatus, imageItem, onStatusUpdate]);

  const currentStatus = jobStatus?.status || imageItem.status || 'uploading';
  const processedFileKey = jobStatus?.processedFileKey || imageItem.downloadUrl;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-accent">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{imageItem.file.name}</h4>
          <p className="text-sm text-muted-foreground">
            {(imageItem.file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {currentStatus === 'processing' && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Processing...</span>
            </div>
          )}
          {currentStatus === 'queued' && (
            <span className="text-xs text-muted-foreground">Queued for processing</span>
          )}
          {currentStatus === 'completed' && processedFileKey && (
            <span className="text-xs text-green-600">Ready to download</span>
          )}
          {currentStatus === 'failed' && (
            <span className="text-xs text-red-600">Processing failed</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {currentStatus === 'completed' && processedFileKey && (
          <Button variant="ghost" size="icon" onClick={onDownload} title="Download">
            <Download className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onRemove} title="Remove">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const ImageResolution = () => {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [resolution, setResolution] = useState([100]);
  const [outputFormat, setOutputFormat] = useState<
    'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
  >('png');
  const [operationMode, setOperationMode] = useState<'convert' | 'resize' | 'compress'>('convert');
  const [compressionQuality, setCompressionQuality] = useState([80]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useFileUpload();

  // Fetch user plan for showing limits in toast
  const { data: userPlan } = useQuery({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate format before staging
      const validation = validateImageFormat(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Unsupported image format');
        return;
      }

      // Get image dimensions and stage with pending status
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
      let width = selectedImage.width;
      let height = selectedImage.height;

      // Step 1: Upload if not uploaded yet
      if (!objectKey) {
        setSelectedImage({ ...selectedImage, status: 'uploading' });

        const { objectKey: uploadedKey } = await uploadMutation.mutateAsync({
          file: selectedImage.file,
          folder: 'temporary',
        });

        objectKey = uploadedKey;
        setSelectedImage({ ...selectedImage, objectKey, status: 'queued' });
      }

      const keyWithoutPrefix = objectKey.replace('temporary/', '');
      const originalFormat = selectedImage.file.name.split('.').pop()?.toLowerCase() || '';

      // Step 2: Process based on operation mode
      let job;
      if (operationMode === 'compress') {
        job = await compressImage({
          key: keyWithoutPrefix,
          quality: compressionQuality[0],
          originalFileName: selectedImage.file.name,
          originalFormat,
          fileSize: selectedImage.file.size,
          width,
          height,
        });
      } else if (operationMode === 'resize') {
        job = await resizeImage({
          key: keyWithoutPrefix,
          scalePercent: resolution[0],
          originalFileName: selectedImage.file.name,
          originalFormat,
          fileSize: selectedImage.file.size,
          width,
          height,
        });
      } else {
        job = await convertImage({
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
    } catch (error) {
      const err = error as { message: string; isLimitError?: boolean };

      if (err.isLimitError) {
        const dailyLimit = userPlan?.dailyImageLimit || 5;
        const operationName = operationMode === 'convert' ? 'conversion' : operationMode;
        toast.error('Daily Image Limit Reached', {
          description: `You've reached your daily limit of ${dailyLimit} image ${operationName}s. Upgrade to PRO for more!`,
          action: {
            label: 'Upgrade',
            onClick: () => (window.location.href = '/pricing'),
          },
          duration: 10000,
        });
      } else {
        console.error('Process error:', error);
        toast.error(`Failed to ${operationMode} image`);
      }
    }
  };

  const handleDownload = async () => {
    if (!selectedImage?.downloadUrl) {
      toast.error('Processed file not available yet');
      return;
    }

    try {
      // downloadUrl contains the processed file key (e.g., "processed/filename.ext")
      const fileName = selectedImage.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
      await downloadFileFromS3(selectedImage.downloadUrl, fileName);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Image Resolution</h1>
          <p className="text-muted-foreground">Increase or decrease image resolution and quality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 border-card-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Drop your image here</h3>
                  <p className="text-muted-foreground mb-6">Or click to browse from your device</p>
                  <Button variant="outline" size="lg">
                    Choose Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleImageSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="mt-6 text-sm text-muted-foreground">
                    Supports: JPG, PNG, WEBP
                    <br />
                    Max file size: 10MB
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {selectedImage && (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageItem
                    imageItem={selectedImage}
                    onRemove={handleRemove}
                    onDownload={handleDownload}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Image Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Operation</label>
                  <Select
                    value={operationMode}
                    onValueChange={value => setOperationMode(value as typeof operationMode)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="convert">Convert Format</SelectItem>
                      <SelectItem value="resize">Resize</SelectItem>
                      <SelectItem value="compress">Compress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {operationMode === 'convert' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Convert to Format</label>
                    <Select
                      value={outputFormat}
                      onValueChange={value => setOutputFormat(value as typeof outputFormat)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPEG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {operationMode === 'resize' && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Resolution: {resolution[0]}%
                    </label>
                    <Slider
                      value={resolution}
                      onValueChange={setResolution}
                      max={200}
                      min={25}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>25%</span>
                      <span>200%</span>
                    </div>
                  </div>
                )}

                {operationMode === 'compress' && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Quality: {compressionQuality[0]}%
                    </label>
                    <Slider
                      value={compressionQuality}
                      onValueChange={setCompressionQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>1%</span>
                      <span>100%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Lower quality = smaller file size
                    </p>
                  </div>
                )}

                {selectedImage && selectedImage.width && selectedImage.height && (
                  <div className="p-4 rounded-xl bg-accent space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original</span>
                      <span className="font-medium">
                        {selectedImage.width}x{selectedImage.height}
                      </span>
                    </div>
                    {operationMode === 'resize' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">New Size</span>
                        <span className="font-medium">
                          {Math.round(selectedImage.width * (resolution[0] / 100))}x
                          {Math.round(selectedImage.height * (resolution[0] / 100))}
                        </span>
                      </div>
                    )}
                    {operationMode === 'convert' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target Format</span>
                        <span className="font-medium uppercase">{outputFormat}</span>
                      </div>
                    )}
                    {operationMode === 'compress' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-medium">{compressionQuality[0]}%</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleProcess}
                  disabled={!selectedImage || selectedImage.status === 'processing'}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {selectedImage?.status === 'processing' ? 'Processing...' : 'Process Image'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResolution;
