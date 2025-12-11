import { usePreviewMode } from '@/contexts/PreviewModeContext';
import { Button } from '@repo/ui/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

export const ModeToggle = () => {
  const { isAuthenticated, toggleAuthMode } = usePreviewMode();

  return (
    <div className="fixed top-20 right-4 z-50">
      <Button
        onClick={toggleAuthMode}
        variant="outline"
        className="gap-2 bg-background/95 backdrop-blur-sm shadow-lg"
      >
        {isAuthenticated ? (
          <>
            <Lock className="w-4 h-4" />
            <span className="font-medium">Preview: Authenticated</span>
          </>
        ) : (
          <>
            <Unlock className="w-4 h-4" />
            <span className="font-medium">Preview: Unauthenticated</span>
          </>
        )}
      </Button>
    </div>
  );
};
