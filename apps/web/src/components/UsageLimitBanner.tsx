import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, FileText, Image, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UsageLimitBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="usage-banner-glass rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 usage-banner-icon">
          <Crown className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="font-space-grotesk font-semibold text-base mb-2 text-foreground">
            Free Plan Limits
          </h3>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-chart-2" />
              <span>5 conversions/day</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Image className="w-4 h-4 text-chart-3" />
              <span>5 image edits/day</span>
            </div>
          </div>
        </div>

        <Button variant="default" size="sm" className="usage-upgrade-button group" asChild>
          <Link to="/pricing">
            <Sparkles className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform" />
            Upgrade
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
