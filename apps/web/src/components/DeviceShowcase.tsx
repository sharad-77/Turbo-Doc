import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Upload, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeviceShowcase = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 showcase-gradient pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk font-bold mb-6">
            Works Everywhere
            <span className="block mt-1 shimmer-text">You Do</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access TurboDoc from any device. Seamless experience across desktop, tablet, and mobile.
          </p>
        </motion.div>

        {/* Device Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-0 showcase-mockup-glow scale-110" />

          {/* MacBook Frame */}
          <motion.div
            className="relative hero-macbook-frame rounded-2xl p-2 shadow-2xl"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.4, ease: 'easeOut' },
            }}
          >
            {/* Screen */}
            <div className="hero-macbook-screen rounded-xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="hero-browser-chrome px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="hero-url-bar rounded-lg px-4 py-1.5 text-xs flex items-center gap-2 max-w-xs w-full justify-center">
                    <svg className="w-3 h-3 text-chart-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    <span className="text-muted-foreground font-inter">turbodoc.app</span>
                  </div>
                </div>
                <div className="w-14" />
              </div>

              {/* App Interface */}
              <div className="bg-background p-6 sm:p-8 min-h-[300px]">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'PDF', color: 'bg-chart-4' },
                    { label: 'Word', color: 'bg-chart-2' },
                    { label: 'Excel', color: 'bg-chart-3' },
                    { label: 'PPT', color: 'bg-chart-1' },
                    { label: 'Images', color: 'bg-chart-5' },
                    { label: 'Merge', color: 'bg-primary' },
                  ].map((item, _i) => (
                    <motion.div
                      key={item.label}
                      className="showcase-tool-card p-4 rounded-xl text-center group cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`w-10 h-10 ${item.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}
                      >
                        <FileText className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <p className="text-xs font-medium text-foreground">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Upload Zone */}
                <div className="hero-upload-zone rounded-xl p-6 text-center">
                  <motion.div
                    className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Upload className="w-5 h-5 text-primary" />
                  </motion.div>
                  <p className="text-sm font-medium text-foreground mb-1">Drop files here</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                </div>

                {/* Progress */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-foreground">document.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-chart-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MacBook Bottom */}
            <div className="hero-macbook-notch h-4 rounded-b-xl flex items-center justify-center">
              <div className="w-16 h-1 bg-border/30 rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button variant="default" size="lg" className="group" asChild>
              <Link to="/convert">
                <Zap className="w-5 h-5 mr-2" />
                Try It Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Available on all devices • No app download required
          </p>
        </motion.div>
      </div>
    </section>
  );
};
