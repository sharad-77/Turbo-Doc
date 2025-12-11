import { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewModeContextType {
  isAuthenticated: boolean;
  toggleAuthMode: () => void;
}

const PreviewModeContext = createContext<PreviewModeContextType | undefined>(undefined);

export const PreviewModeProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleAuthMode = () => {
    setIsAuthenticated(prev => !prev);
  };

  return (
    <PreviewModeContext.Provider value={{ isAuthenticated, toggleAuthMode }}>
      {children}
    </PreviewModeContext.Provider>
  );
};

export const usePreviewMode = () => {
  const context = useContext(PreviewModeContext);
  if (!context) {
    throw new Error('usePreviewMode must be used within PreviewModeProvider');
  }
  return context;
};
