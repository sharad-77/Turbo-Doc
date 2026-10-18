'use client';

import { useEffect } from 'react';
import { useJobStatusQuery } from '@/api';
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
import { useConvert, type UploadedFile } from './hooks/useConvert';

function ConvertFileRow({
  fileItem,
  onRemove,
  onDownload,
  onStatusUpdate,
}: {
  fileItem: UploadedFile;
  onRemove: () => void;
  onDownload: () => void;
  onStatusUpdate: (file: File, status: UploadedFile['status'], downloadUrl?: string) => void;
}) {
  const { data: jobStatus } = useJobStatusQuery({
    jobId: fileItem.jobId || '',
    enabled: !!fileItem.jobId && fileItem.status !== 'completed' && fileItem.status !== 'failed',
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentStatus = jobStatus?.status || fileItem.status || 'uploading';
  const processedFileKey = jobStatus?.processedFileKey || fileItem.downloadUrl;

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
}

export function ConvertView() {
  const { state, actions } = useConvert();
  const {
    files,
    sortedFiles,
    dragActive,
    outputFormat,
    operationMode,
    isProcessing,
    splitRange,
    fileInputRef,
  } = state;

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
                  onDragEnter={actions.handleDrag}
                  onDragLeave={actions.handleDrag}
                  onDragOver={actions.handleDrag}
                  onDrop={actions.handleDrop}
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
                    onChange={actions.handleFileSelect}
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
                    onClick={actions.handleStartProcessing}
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
                    <Button variant="outline" size="sm" onClick={() => actions.setFiles([])}>
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedFiles.map((fileItem, index) => (
                      <ConvertFileRow
                        key={index}
                        fileItem={fileItem}
                        onRemove={() => actions.removeFile(index)}
                        onDownload={() => actions.handleDownload(fileItem)}
                        onStatusUpdate={actions.handleStatusUpdate}
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
                    onValueChange={value =>
                      actions.setOutputFormat(value as typeof outputFormat)
                    }
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
                        onChange={e =>
                          actions.setSplitRange({ ...splitRange, startPage: e.target.value })
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
                        onChange={e =>
                          actions.setSplitRange({ ...splitRange, endPage: e.target.value })
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
                        actions.setOperationMode(tool.id);
                        actions.setFiles([]);
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
}
