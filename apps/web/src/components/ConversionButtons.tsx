import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  File,
  FileSpreadsheet,
  FileText,
  Image,
  Merge,
  Presentation,
  RotateCcw,
  Scissors,
  Stamp,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const conversions = [
  {
    icon: FileText,
    title: 'PDF Converter',
    description: 'Convert to/from PDF',
  },
  {
    icon: FileText,
    title: 'Word Documents',
    description: 'DOC, DOCX conversions',
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Files',
    description: 'XLS, XLSX, CSV',
  },
  {
    icon: Presentation,
    title: 'PowerPoint',
    description: 'PPT, PPTX slides',
  },
  {
    icon: Image,
    title: 'Images',
    description: 'JPG, PNG, WebP',
  },
  {
    icon: File,
    title: 'Text Files',
    description: 'TXT, RTF, HTML',
  },
  {
    icon: Merge,
    title: 'Merge Files',
    description: 'Combine documents',
  },
  {
    icon: Scissors,
    title: 'Split PDFs',
    description: 'Extract pages',
  },
  {
    icon: RotateCcw,
    title: 'Rotate & Reorder',
    description: 'Fix orientation',
  },
  {
    icon: Stamp,
    title: 'Watermarks',
    description: 'Add protection',
  },
];

import { type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const ConversionButtons = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute inset-0 conversion-section-gradient pointer-events-none" />

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
            Choose Your
            <span className="block mt-1 shimmer-text">Conversion Type</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from our comprehensive toolkit of document conversion and editing tools.
          </p>
        </motion.div>

        {/* Conversion Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
        >
          {conversions.map((conversion, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                to="/convert"
                className="conversion-card group block p-5 rounded-2xl text-center h-full"
              >
                <div className="conversion-icon-wrapper w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <conversion.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-sm mb-1 text-foreground">
                  {conversion.title}
                </h3>
                <p className="text-xs text-muted-foreground">{conversion.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button variant="default" size="lg" className="conversion-cta-button group" asChild>
              <Link to="/convert">
                <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Converting Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Enterprise features available
          </p>
        </motion.div>
      </div>
    </section>
  );
};
