import { Button } from '@repo/ui/components/ui/button';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
  Play,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-grid" />
      <div className="absolute inset-0 hero-radial-mask" />

      {/* Floating Ambient Glows */}
      <motion.div
        className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full hero-orb-primary pointer-events-none"
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full hero-orb-secondary pointer-events-none"
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full hero-orb-center pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Split Layout: Content Left, Mockup Right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* New Feature Badge */}
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 hero-badge px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-inter">New: AI-Powered Processing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-space-grotesk font-bold mb-6 tracking-[-0.03em] leading-[1.05]"
            >
              <span className="text-foreground">Transform Your</span>
              <br />
              <span className="text-foreground">Documents </span>
              <span className="shimmer-text-enhanced">Effortlessly</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed font-inter"
            >
              Convert, merge, split, and compress documents with enterprise-grade precision. From
              PDF to Word, images to PDF — all in one powerful platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                variant="default"
                size="lg"
                className="min-w-[180px] h-13 text-base font-medium hero-button-primary group"
              >
                Start Converting
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[180px] h-13 text-base font-medium hero-button-secondary group"
              >
                <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-inter"
            >
              {[
                { label: '99.9% Uptime', icon: Shield },
                { label: 'GDPR Compliant', icon: CheckCircle2 },
                { label: '50K+ Users', icon: Sparkles },
              ].map(item => (
                <span key={item.label} className="flex items-center gap-2 hero-trust-item">
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column - MacBook Mockup */}
          <motion.div
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="relative lg:pl-8"
          >
            {/* Multi-layer Glow Effect Behind MacBook */}
            <div className="absolute inset-0 hero-macbook-glow scale-110" />

            {/* MacBook Frame with Hover Effect */}
            <motion.div
              className="relative hero-macbook-frame rounded-2xl p-2 shadow-2xl"
              initial={{ rotateX: 4, rotateY: -3 }}
              whileHover={{
                rotateX: 0,
                rotateY: 0,
                scale: 1.02,
                transition: { duration: 0.5, ease: 'easeOut' },
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                transformOrigin: 'center center',
              }}
            >
              {/* Screen Bezel */}
              <div className="hero-macbook-screen rounded-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="hero-browser-chrome px-4 py-3 flex items-center gap-3">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  </div>
                  {/* URL Bar */}
                  <div className="flex-1 flex justify-center">
                    <div className="hero-url-bar rounded-lg px-4 py-1.5 text-xs flex items-center gap-2 max-w-xs w-full justify-center">
                      <svg className="w-3 h-3 text-chart-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                      <span className="text-muted-foreground font-inter">turbodoc.app/convert</span>
                    </div>
                  </div>
                  <div className="w-14" />
                </div>

                {/* App Interface Mockup */}
                <div className="bg-background p-5 sm:p-8 min-h-[280px] sm:min-h-[340px]">
                  <div className="max-w-md mx-auto">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-base font-space-grotesk font-semibold text-foreground">
                          Document Conversion
                        </h3>
                        <p className="text-xs text-muted-foreground font-inter">
                          Drop files to convert
                        </p>
                      </div>
                      <span className="hero-pro-badge px-2.5 py-1 text-xs font-semibold rounded-full">
                        Pro
                      </span>
                    </div>

                    {/* Upload Zone */}
                    <motion.div
                      className="hero-upload-zone rounded-xl p-6 sm:p-8 text-center"
                      whileHover={{ borderColor: 'oklch(var(--primary) / 0.6)' }}
                    >
                      <motion.div
                        className="hero-upload-icon w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Upload className="w-6 h-6 text-primary" />
                      </motion.div>
                      <p className="text-foreground font-medium text-sm mb-1 font-space-grotesk">
                        Drag & drop files here
                      </p>
                      <p className="text-xs text-muted-foreground font-inter mb-3">
                        PDF, DOCX, PNG, JPG up to 50MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-inter text-xs hero-browse-button h-8"
                      >
                        Browse Files
                      </Button>
                    </motion.div>

                    {/* Progress Indicator */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span className="font-inter text-foreground">report_2024.docx</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-chart-3">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-inter">Done</span>
                        </div>
                      </div>
                      <div className="hero-progress-bar h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full hero-progress-fill rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.5, delay: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MacBook Bottom/Notch */}
              <div className="hero-macbook-notch h-4 rounded-b-xl flex items-center justify-center">
                <div className="w-16 h-1 bg-border/30 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards Row */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-16 lg:mt-24"
        >
          {[
            {
              icon: Zap,
              title: 'Instant Conversion',
              description: 'Convert any document in seconds with AI precision.',
            },
            {
              icon: Layers,
              title: 'Batch Processing',
              description: 'Process hundreds of files simultaneously.',
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Bank-grade encryption for all your documents.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="hero-glass-card rounded-xl p-5 text-center"
              whileHover={{
                y: -6,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              custom={0.6 + index * 0.1}
            >
              <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center hero-feature-icon">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-space-grotesk font-semibold mb-1.5 text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
