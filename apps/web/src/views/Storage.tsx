import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Progress } from '@repo/ui/components/ui/progress';
import { Clock, Download, FileText, Filter, HardDrive, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Storage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const storageStats = {
    used: 2.4,
    total: 10,
    files: 48,
  };

  const files = [
    {
      id: 1,
      name: 'quarterly-report.pdf',
      size: '2.4 MB',
      type: 'PDF',
      date: '2024-03-15',
      status: 'completed',
    },
    {
      id: 2,
      name: 'presentation-slides.pdf',
      size: '8.7 MB',
      type: 'PDF',
      date: '2024-03-14',
      status: 'completed',
    },
    {
      id: 3,
      name: 'invoice-template.pdf',
      size: '1.2 MB',
      type: 'PDF',
      date: '2024-03-13',
      status: 'completed',
    },
    {
      id: 4,
      name: 'contract-draft.pdf',
      size: '892 KB',
      type: 'PDF',
      date: '2024-03-12',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Storage</h1>
          <p className="text-muted-foreground">Manage your converted files and storage</p>
        </div>

        {/* Storage Stats */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {storageStats.used} GB of {storageStats.total} GB used
                </span>
                <span className="text-sm text-muted-foreground">{storageStats.files} files</span>
              </div>
              <Progress value={(storageStats.used / storageStats.total) * 100} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {storageStats.total - storageStats.used} GB available
              </p>
              <Button variant="outline" size="sm">
                Upgrade Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="modern-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Files</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{file.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{file.type}</Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Storage;
