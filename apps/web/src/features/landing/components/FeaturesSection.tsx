import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  Image,
  Maximize,
  Merge,
  RotateCcw,
  Shield,
  Stamp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: FileText,
    title: 'Document Conversion',
    description: 'Convert between Word, PDF, PowerPoint, Excel with perfect formatting.',
  },
  {
    icon: Image,
    title: 'Image Processing',
    description: 'Transform images to PDF, extract images, and optimize file sizes.',
  },
  {
    icon: Merge,
    title: 'Merge & Split',
    description: 'Combine documents or split large files into manageable pieces.',
  },
  {
    icon: RotateCcw,
    title: 'Rotate & Reorder',
    description: 'Rotate pages, reorder sections, and fix orientation issues.',
  },
  {
    icon: Maximize,
    title: 'Compress Files',
    description: 'Reduce file sizes while maintaining quality for easy sharing.',
  },
  {
    icon: Stamp,
    title: 'Add Watermarks',
    description: 'Protect documents with custom watermarks and security stamps.',
  },
  {
    icon: Shield,
    title: 'Secure Processing',
    description: 'Enterprise-grade encryption with automatic file deletion.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process documents in seconds with optimized cloud infrastructure.',
  },
  {
    icon: Download,
    title: 'Batch Downloads',
    description: 'Process multiple files and download them as a ZIP archive.',
  },
];

import { type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 features-gradient pointer-events-none" />

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
            Everything you need to manage
            <span className="block mt-1 shimmer-text">your documents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From simple conversions to complex document workflows — professional-grade reliability
            and speed.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="feature-card-modern group">
              <div className="feature-icon-modern w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-space-grotesk font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>
              <Link
                href="/convert"
                className="text-sm font-medium text-primary hover:text-chart-2 transition-colors inline-flex items-center gap-1 group/link touch-manipulation"
              >
                Learn more
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="features-cta-card inline-flex items-center gap-4 rounded-2xl p-6">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                >
                  <Zap className="w-4 h-4 text-primary" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-space-grotesk font-semibold text-foreground mb-0.5">
                Need custom features?
              </p>
              <p className="text-sm text-muted-foreground">
                Contact us for enterprise solutions and API integrations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
