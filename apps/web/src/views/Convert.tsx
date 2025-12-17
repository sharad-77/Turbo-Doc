'use client';

import { convertDocument, downloadFileFromS3, useFileUpload, useJobStatus } from '@/api';
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
import { Switch } from '@repo/ui/components/ui/switch';
import {
  Clock,
  Download,
  FileText,
  Layers,
  Merge,
  RotateCcw,
  Scissors,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  objectKey?: string;
  jobId?: string;
  status?: 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}

// File Item Component
const FileItem = ({
  fileItem,
  onRemove,
  onDownload,
  onStatusUpdate,
}: {
  fileItem: UploadedFile;
  onRemove: () => void;
  onDownload: () => void;
  onStatusUpdate: (file: File, status: UploadedFile['status'], downloadUrl?: string) => void;
}) => {
  const { data: jobStatus } = useJobStatus({
    jobId: fileItem.jobId || '',
    type: 'document',
    enabled: !!fileItem.jobId && fileItem.status !== 'completed' && fileItem.status !== 'failed',
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Update file status from job status
  const currentStatus = jobStatus?.status || fileItem.status || 'uploading';
  // processedFileKey is the S3 key (e.g., "processed/filename.ext")
  const processedFileKey = jobStatus?.processedFileKey || fileItem.downloadUrl;

  // Update parent when job status changes (using useEffect to avoid render-time updates)
  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.status === 'completed' && jobStatus.processedFileKey && !fileItem.downloadUrl) {
      onStatusUpdate(fileItem.file, 'completed', jobStatus.processedFileKey);
    } else if (jobStatus.status === 'failed' && fileItem.status !== 'failed') {
      onStatusUpdate(fileItem.file, 'failed');
    } else if (jobStatus.status === 'processing' && fileItem.status !== 'processing') {
      onStatusUpdate(fileItem.file, 'processing');
    }
  }, [jobStatus, fileItem, onStatusUpdate]);

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-accent">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{fileItem.file.name}</h4>
          <p className="text-sm text-muted-foreground">{formatFileSize(fileItem.file.size)}</p>
          {currentStatus === 'processing' && (
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Processing...</span>
            </div>
          )}
          {currentStatus === 'queued' && (
            <span className="text-xs text-muted-foreground">Queued for conversion</span>
          )}
          {currentStatus === 'completed' && processedFileKey && (
            <span className="text-xs text-green-600">Ready to download</span>
          )}
          {currentStatus === 'failed' && (
            <span className="text-xs text-red-600">Conversion failed</span>
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

const Convert = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx' | 'txt' | 'doc'>('pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useFileUpload();

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

  const handleFiles = async (fileList: File[]) => {
    for (const file of fileList) {
      const uploadedFile: UploadedFile = { file, status: 'uploading' };
      setFiles(prev => [...prev, uploadedFile]);

      try {
        // Upload file to S3
        const { objectKey } = await uploadMutation.mutateAsync({
          file,
          folder: 'temporary',
        });

        // Extract key without folder prefix for API
        const keyWithoutPrefix = objectKey.replace('temporary/', '');

        // Get file extension
        const originalFormat = file.name.split('.').pop()?.toLowerCase() || '';

        // Start conversion
        const job = await convertDocument({
          key: keyWithoutPrefix,
          targetFormat: outputFormat,
          originalFileName: file.name,
          originalFormat,
          fileSize: file.size,
        });

        // Update file with job info
        setFiles(prev =>
          prev.map(f =>
            f.file === file ? { ...f, objectKey, jobId: job.jobId, status: 'queued' } : f
          )
        );

        toast.success(`${file.name} uploaded and conversion started`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        setFiles(prev => prev.filter(f => f.file !== file));
      }
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

    try {
      // downloadUrl contains the processed file key (e.g., "processed/filename.ext")
      const fileName = file.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
      await downloadFileFromS3(file.downloadUrl, fileName);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleStatusUpdate = (file: File, status: UploadedFile['status'], downloadUrl?: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.file === file ? { ...f, status, downloadUrl: downloadUrl || f.downloadUrl } : f
      )
    );
  };

  const conversionTools = [
    {
      id: 'merge',
      name: 'Merge PDFs',
      icon: Merge,
      description: 'Combine multiple PDFs into one',
    },
    {
      id: 'split',
      name: 'Split PDF',
      icon: Scissors,
      description: 'Split PDF into separate pages',
    },
    {
      id: 'rotate',
      name: 'Rotate Pages',
      icon: RotateCcw,
      description: 'Rotate PDF pages',
    },
    {
      id: 'compress',
      name: 'Compress',
      icon: Layers,
      description: 'Reduce file size',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Document Conversion</h1>
          <p className="text-muted-foreground">Convert documents between formats with ease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-primary bg-primary/5 scale-[1.02]'
                      : 'border-card-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Drop your files here</h3>
                  <p className="text-muted-foreground mb-6">Or click to browse from your device</p>
                  <Button variant="outline" size="lg">
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  />
                  <div className="mt-6 text-sm text-muted-foreground">
                    Supports: PDF, Word, PowerPoint, Excel
                    <br />
                    Max file size: 10MB per file
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Files ({files.length})</span>
                    <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((fileItem, index) => (
                      <FileItem
                        key={index}
                        fileItem={fileItem}
                        onRemove={() => removeFile(index)}
                        onDownload={() => handleDownload(fileItem)}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Conversion Settings */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Convert to</label>
                  <Select
                    value={outputFormat}
                    onValueChange={value => setOutputFormat(value as typeof outputFormat)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="txt">Text File</SelectItem>
                      <SelectItem value="doc">Word Document (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Quality: High</label>
                  <Slider defaultValue={[80]} max={100} min={10} step={10} className="w-full" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Preserve formatting</label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">OCR (Text recognition)</label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Quick Tools */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Quick Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {conversionTools.map(tool => (
                    <Button
                      key={tool.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <tool.icon className="w-5 h-5" />
                      <div className="text-center">
                        <div className="font-medium text-xs">{tool.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;
