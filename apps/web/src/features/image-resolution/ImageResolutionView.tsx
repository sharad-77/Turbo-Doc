'use client';

import { useEffect } from 'react';
import { useImageJobStatusQuery } from '@/api';
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
import { Download, ImageIcon, Upload, X, Zap } from 'lucide-react';
import { useImageResolution, type UploadedImage } from './hooks/useImageResolution';

function ImageItemRow({
  imageItem,
  onRemove,
  onDownload,
  onStatusUpdate,
}: {
  imageItem: UploadedImage;
  onRemove: () => void;
  onDownload: () => void;
  onStatusUpdate: (file: File, status: UploadedImage['status'], downloadUrl?: string) => void;
}) {
  const { data: jobStatus } = useImageJobStatusQuery({
    jobId: imageItem.jobId || '',
    enabled: !!imageItem.jobId && imageItem.status !== 'completed' && imageItem.status !== 'failed',
  });

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
}

export function ImageResolutionView() {
  const { state, actions } = useImageResolution();
  const {
    selectedImage,
    resolution,
    outputFormat,
    operationMode,
    compressionQuality,
    fileInputRef,
    isProcessing,
  } = state;

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
                    onChange={actions.handleImageSelect}
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
                  <ImageItemRow
                    imageItem={selectedImage}
                    onRemove={actions.handleRemove}
                    onDownload={actions.handleDownload}
                    onStatusUpdate={actions.handleStatusUpdate}
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
                    onValueChange={value =>
                      actions.setOperationMode(value as typeof operationMode)
                    }
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
                      onValueChange={value =>
                        actions.setOutputFormat(value as typeof outputFormat)
                      }
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
                      onValueChange={actions.setResolution}
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
                      onValueChange={actions.setCompressionQuality}
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
                          {Math.round(selectedImage.width * ((resolution[0] ?? 100) / 100))}x
                          {Math.round(selectedImage.height * ((resolution[0] ?? 100) / 100))}
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
                  onClick={actions.handleProcess}
                  disabled={!selectedImage || isProcessing}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Process Image'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
