import { ConversionButtons } from '@/components/ConversionButtons';
import { CTASection } from '@/components/CTASection';
import { DeviceShowcase } from '@/components/DeviceShowcase';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
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
