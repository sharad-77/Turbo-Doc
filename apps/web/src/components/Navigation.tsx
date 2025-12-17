import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@repo/ui/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/convert', label: 'Convert' },
    { href: '/image-resolution', label: 'Image Tools' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/#features', label: 'Features' }
  ];

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-500 ${
        isScrolled
          ? 'nav-glass shadow-soft-lg'
          : 'bg-background/60 backdrop-blur-md border border-border/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-space-grotesk font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              TurboDoc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="default" size="sm" className="nav-cta-button p-4" asChild>
              <Link href="/signup">
                Get Started
                <span className="ml-1.5 text-xs opacity-70">— Free</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-border/50">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 space-y-2"
                >
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button variant="default" className="w-full" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
