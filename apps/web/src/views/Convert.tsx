'use client';

import { downloadFileFromS3, useFileUpload, useJobStatus } from '@/api';
import { convertDocument, mergePdfs, splitPdf } from '@/api/documents';
import { getUserPlan } from '@/api/plans';
import { validateDocumentFormat } from '@/lib/format-validation';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  Download,
  FileText,
  Loader2,
  Merge,
  Scissors,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type OperationMode = 'convert' | 'merge' | 'split';

interface UploadedFile {
  file: File;
  objectKey?: string;
  jobId?: string;
  status?: 'pending' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
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
  const [operationMode, setOperationMode] = useState<OperationMode>('convert');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitRange, setSplitRange] = useState({ startPage: '', endPage: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useFileUpload();

  // Fetch user plan for showing limits in toast
  const { data: userPlan } = useQuery({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

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
      // Validate format before adding
      const validation = validateDocumentFormat(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Unsupported file format');
        continue;
      }

      // For merge mode, only allow PDFs
      if (operationMode === 'merge' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast.error(`${file.name}: Only PDF files can be merged`);
        continue;
      }

      // For split mode, only allow single PDF
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

    // Validate based on operation mode
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
      // Step 1: Upload all files to S3
      const uploadedFiles: { file: File; key: string }[] = [];

      for (const fileItem of files) {
        if (fileItem.objectKey) {
          // Already uploaded
          uploadedFiles.push({
            file: fileItem.file,
            key: fileItem.objectKey.replace('temporary/', ''),
          });
          continue;
        }

        // Update status to uploading
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

          // Update with object key
          setFiles(prev =>
            prev.map(f =>
              f.file === fileItem.file ? { ...f, objectKey, status: 'queued' as const } : f
            )
          );
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${fileItem.file.name}`);
          setFiles(prev =>
            prev.map(f => (f.file === fileItem.file ? { ...f, status: 'failed' as const } : f))
          );
          setIsProcessing(false);
          return;
        }
      }

      // Step 2: Call appropriate API based on operation mode
      if (operationMode === 'convert') {
        // Convert each file individually
        for (const { file, key } of uploadedFiles) {
          const originalFormat = file.name.split('.').pop()?.toLowerCase() || '';

          try {
            const job = await convertDocument({
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

            toast.success(`${file.name} conversion started`);
          } catch (error) {
            console.error('Conversion error:', error);
            toast.error(`Failed to convert ${file.name}`);
            setFiles(prev =>
              prev.map(f => (f.file === file ? { ...f, status: 'failed' as const } : f))
            );
          }
        }
      } else if (operationMode === 'merge') {
        // Merge all PDFs into one
        const keys = uploadedFiles.map(uf => uf.key);
        const totalSize = uploadedFiles.reduce((sum, uf) => sum + uf.file.size, 0);
        const mergedFileName = `merged-${Date.now()}.pdf`;

        try {
          const job = await mergePdfs({
            keys,
            originalFileName: mergedFileName,
            originalFormat: 'pdf',
            fileSize: totalSize,
          });

          // Replace all input files with one merged file
          const mergedFile = new File([], mergedFileName, { type: 'application/pdf' });
          setFiles([
            {
              file: mergedFile,
              jobId: job.jobId,
              status: 'queued' as const,
            },
          ]);

          toast.success('PDF merge started');
        } catch (error) {
          const err = error as { message: string; isLimitError?: boolean };

          if (err.isLimitError) {
            const dailyLimit = userPlan?.dailyDocumentLimit || 1;
            toast.error('Daily Merge Limit Reached', {
              description: `You've reached your daily limit of ${dailyLimit === 1 ? '1 merge' : `${dailyLimit} merges`}. Upgrade to PRO for more!`,
              action: {
                label: 'Upgrade',
                onClick: () => (window.location.href = '/pricing'),
              },
              duration: 10000,
            });
          } else {
            console.error('Merge error:', error);
            toast.error('Failed to merge PDFs');
          }
          setFiles(prev => prev.map(f => ({ ...f, status: 'failed' as const })));
        }
      } else if (operationMode === 'split') {
        // Split single PDF
        const { file, key } = uploadedFiles[0];

        // Parse page numbers from string inputs
        const startPage = parseInt(splitRange.startPage) || 1;
        const endPage = parseInt(splitRange.endPage) || 1;

        const baseName = file.name.replace(/\.pdf$/i, '');
        const splitFileName = `${baseName}_pages_${startPage}-${endPage}.pdf`;

        try {
          const job = await splitPdf({
            key,
            startPage,
            endPage,
            originalFileName: file.name,
            fileSize: file.size,
          });

          // Replace original file with split result file
          const splitFile = new File([], splitFileName, { type: 'application/pdf' });
          setFiles([
            {
              file: splitFile,
              jobId: job.jobId,
              status: 'queued' as const,
            },
          ]);

          toast.success(`PDF split started (pages ${startPage}-${endPage})`);
        } catch (error) {
          const err = error as { message: string; isLimitError?: boolean };

          if (err.isLimitError) {
            const dailyLimit = userPlan?.dailyDocumentLimit || 1;
            toast.error('Daily Split Limit Reached', {
              description: `You've reached your daily limit of ${dailyLimit === 1 ? '1 split' : `${dailyLimit} splits`}. Upgrade to PRO for more!`,
              action: {
                label: 'Upgrade',
                onClick: () => (window.location.href = '/pricing'),
              },
              duration: 10000,
            });
          } else {
            console.error('Split error:', error);
            toast.error('Failed to split PDF');
          }
          setFiles(prev =>
            prev.map(f => (f.file === file ? { ...f, status: 'failed' as const } : f))
          );
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('An error occurred during processing');
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
      id: 'convert' as const,
      name: 'Format Conversion',
      icon: FileText,
      description: 'Convert to PDF, DOCX, TXT',
    },
    {
      id: 'merge' as const,
      name: 'Merge PDFs',
      icon: Merge,
      description: 'Combine multiple PDFs',
    },
    {
      id: 'split' as const,
      name: 'Split PDF',
      icon: Scissors,
      description: 'Extract page range',
    },
  ];

  // Sort files - processing/queued files first
  const sortedFiles = [...files].sort((a, b) => {
    const statusOrder: Record<UploadedFile['status'] & string, number> = {
      processing: 0,
      queued: 1,
      uploading: 2,
      pending: 3,
      completed: 4,
      failed: 5,
    };
    return statusOrder[a.status || 'pending'] - statusOrder[b.status || 'pending'];
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
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

            {/* Start Processing Button */}
            {files.length > 0 && (
              <Card className="modern-card">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleStartProcessing}
                    disabled={isProcessing || files.length === 0}
                    size="lg"
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Start{' '}
                        {operationMode === 'convert'
                          ? 'Conversion'
                          : operationMode === 'merge'
                            ? 'Merge'
                            : 'Split'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

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
                    {sortedFiles.map((fileItem, index) => (
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

                {/* Split Page Range (only in split mode) */}
                {operationMode === 'split' && (
                  <div className="space-y-4 p-4 bg-accent rounded-2xl">
                    <div>
                      <Label htmlFor="startPage" className="text-sm font-medium mb-2 block">
                        Start Page
                      </Label>
                      <Input
                        id="startPage"
                        type="number"
                        min={1}
                        placeholder="1"
                        value={splitRange.startPage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSplitRange(prev => ({ ...prev, startPage: e.target.value }))
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endPage" className="text-sm font-medium mb-2 block">
                        End Page
                      </Label>
                      <Input
                        id="endPage"
                        type="number"
                        min={1}
                        placeholder="1"
                        value={splitRange.endPage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSplitRange(prev => ({ ...prev, endPage: e.target.value }))
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tools */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Quick Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {conversionTools.map(tool => (
                    <Button
                      key={tool.id}
                      variant={operationMode === tool.id ? 'default' : 'outline'}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => {
                        setOperationMode(tool.id);
                        // Clear files when switching modes
                        setFiles([]);
                      }}
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
