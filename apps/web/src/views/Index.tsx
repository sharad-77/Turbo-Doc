import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ConversionButtons } from '@/components/ConversionButtons';
import { DeviceShowcase } from '@/components/DeviceShowcase';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { UsageLimitBanner } from '@/components/UsageLimitBanner';
import { usePreviewMode } from '@/contexts/PreviewModeContext';

const Index = () => {
  const { isAuthenticated } = usePreviewMode();

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        {!isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UsageLimitBanner />
          </div>
        )}
        <StatsSection />
        <ConversionButtons />
        <DeviceShowcase />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
