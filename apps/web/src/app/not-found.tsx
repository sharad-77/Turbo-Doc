'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="modern-card p-8 md:p-12 text-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <FileQuestion className="w-16 h-16 text-primary" />
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 animate-ping" />
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-8xl md:text-9xl font-space-grotesk font-bold text-primary mb-4"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Home Page
              </Link>
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Or try these helpful links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/convert"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                Document Conversion
              </Link>
              <Link
                href="/image-resolution"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                Image Processing
              </Link>
              <Link
                href="/storage"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                File Storage
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                Pricing Plans
              </Link>
            </div>
          </motion.div>
        </Card>

        {/* Error Code Reference */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Error Code: 404 • HTTP Not Found
        </motion.p>
      </motion.div>
    </div>
  );
}
