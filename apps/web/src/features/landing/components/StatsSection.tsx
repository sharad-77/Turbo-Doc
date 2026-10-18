import { TrendingUp, Users, FileCheck, Globe, type LucideIcon } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    description: 'Professionals trust us daily',
  },
  {
    icon: FileCheck,
    value: '2M+',
    label: 'Documents Processed',
    description: 'Files converted this month',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Uptime',
    description: 'Enterprise reliability',
  },
  {
    icon: Globe,
    value: '150+',
    label: 'Countries',
    description: 'Global reach',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export const StatsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 stats-gradient pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="stats-card text-center group"
            >
              <div className="stats-icon-wrapper w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-space-grotesk font-bold mb-2 stats-value">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
