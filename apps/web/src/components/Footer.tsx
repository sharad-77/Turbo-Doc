import { motion } from 'framer-motion';
import { CreditCard, FileText, Mail, Shield, XCircle } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Privacy Policy',
    url: '/privacy-policy',
    icon: Shield,
  },
  {
    title: 'Refund Policy',
    url: '/refund-policy',
    icon: CreditCard,
  },
  {
    title: 'Cancellation Policy',
    url: '/cancellation-policy',
    icon: XCircle,
  },
  {
    title: 'Contact Support',
    url: '/contact',
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative mt-20 border-t border-border bg-card/50 backdrop-blur-sm"
    >
      {/* Subtle glow accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-space-grotesk font-semibold">TurboDoc</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Convert, compress, and transform your documents with ease. Fast, secure, and reliable
              document processing.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-space-grotesk font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/convert"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Document Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h4 className="font-space-grotesk font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.title}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-space-grotesk font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:support@turbodoc.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@turbodoc.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} TurboDoc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/refund-policy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Refunds
              </Link>
              <Link
                href="/cancellation-policy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancellations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
