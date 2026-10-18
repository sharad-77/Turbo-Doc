import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export const CTASection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-20"
          style={{ backgroundColor: 'oklch(.488 .243 264.376)' }}
        >
          {/* Animated glow orbs */}
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-chart-2/15 rounded-full blur-3xl pointer-events-none"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Tech grid overlay */}
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 cta-badge px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Start your free trial today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk font-bold mb-6 text-foreground"
            >
              Ready to transform your
              <span className="block mt-1 shimmer-text-enhanced">document workflow?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Join thousands of professionals who save hours every week with our powerful document
              toolkit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="default"
                size="lg"
                className="min-w-[200px] cta-primary-button group touch-manipulation"
                asChild
              >
                <Link href="/signup">
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] cta-secondary-button touch-manipulation"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mt-6"
            >
              No credit card required • Free forever plan available • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
