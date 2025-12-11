import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, CheckCircle, Download, FileText, Image, Settings, Upload } from 'lucide-react';
import { useState } from 'react';

export const UploadPreview = () => {
  const [dragActive, setDragActive] = useState(false);

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
    // Handle file drop logic here
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk font-bold mb-6">
            Try it right now
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Document Toolkit with our live demo. Upload a file and see the
            magic happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Upload Area */}
          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-card-border hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Drop your files here</h3>
              <p className="text-muted-foreground mb-6">Or click to browse from your device</p>
              <Button variant="outline" size="lg">
                Choose Files
              </Button>
              <div className="mt-6 text-sm text-muted-foreground">
                Supports: PDF, Word, PowerPoint, Excel, Images (JPG, PNG)
                <br />
                Max file size: 10MB for free users
              </div>
            </div>

            {/* Conversion Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="feature-card !p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold">Convert to PDF</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect formatting preservation</p>
              </div>
              <div className="feature-card !p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Image className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-semibold">To Images</span>
                </div>
                <p className="text-sm text-muted-foreground">High-quality JPG/PNG output</p>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-6">
            {/* Mock Conversion Process */}
            <div className="feature-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Conversion Preview</h3>
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* File Preview */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-background-subtle rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">sample-document.docx</p>
                    <p className="text-sm text-muted-foreground">2.4 MB • 12 pages</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>

                <div className="flex items-center justify-center py-4">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-background-subtle rounded-2xl border-2 border-dashed border-primary/30">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">sample-document.pdf</p>
                    <p className="text-sm text-muted-foreground">1.8 MB • Ready to download</p>
                  </div>
                  <Download className="w-5 h-5 text-success" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Converting...</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-background-subtle rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: '95%' }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="cta" className="flex-1">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features Note */}
            <div className="bg-primary/5 rounded-2xl p-6">
              <h4 className="font-semibold mb-3">What happens next?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Files are processed on secure servers</p>
                <p>✓ Original formatting is preserved</p>
                <p>✓ Files are automatically deleted after 24 hours</p>
                <p>✓ Download links are sent to your email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
