import { Badge } from '@repo/ui/components/ui/badge';
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
import { Image as ImageIcon, Upload, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

const ImageResolution = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resolution, setResolution] = useState([100]);
  const [outputFormat, setOutputFormat] = useState('png');
  const [usageCount, setUsageCount] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxDaily = 5;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    // Process logic here
    setUsageCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Image Resolution</h1>
          <p className="text-muted-foreground">Increase or decrease image resolution and quality</p>
        </div>

        {/* Usage Warning for Unauthenticated */}

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
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-accent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedImage.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Resolution Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Convert to Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                      <SelectItem value="bmp">BMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

                <div className="p-4 rounded-xl bg-accent space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original</span>
                    <span className="font-medium">1920x1080</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New Size</span>
                    <span className="font-medium">
                      {Math.round(1920 * (resolution[0] / 100))}x
                      {Math.round(1080 * (resolution[0] / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium uppercase">{outputFormat}</span>
                  </div>
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleProcess}
                  disabled={!selectedImage}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Process Image
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
