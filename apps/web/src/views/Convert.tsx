import { UsageLimitBanner } from '@/components/UsageLimitBanner';
import { usePreviewMode } from '@/contexts/PreviewModeContext';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';
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
  FileText,
  Layers,
  Merge,
  RotateCcw,
  Scissors,
  Settings,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { useRef, useState } from 'react';

const Convert = () => {
  const { isAuthenticated } = usePreviewMode();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startConversion = () => {
    setConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

        {!isAuthenticated && <UsageLimitBanner />}

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
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <div className="mt-6 text-sm text-muted-foreground">
                    Supports: PDF, Word, PowerPoint, Excel, Images
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
                    <span>Selected Files ({files.length})</span>
                    <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-2xl bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversion Progress */}
            {converting && (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary animate-spin" />
                    Converting Files...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span>Processing {files.length} files</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {files.length > 0 && !converting && (
              <Button variant="hero" size="lg" className="w-full" onClick={startConversion}>
                <Zap className="w-4 h-4 mr-2" />
                Start Conversion
              </Button>
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
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="jpg">JPEG Image</SelectItem>
                      <SelectItem value="png">PNG Image</SelectItem>
                      <SelectItem value="pptx">PowerPoint</SelectItem>
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

            {/* Usage Stats */}
            {!isAuthenticated && (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Today&apos;s Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Conversions</span>
                      <span>2 / 5</span>
                    </div>
                    <Progress value={40} />
                    <p className="text-xs text-muted-foreground">3 conversions remaining today</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;
