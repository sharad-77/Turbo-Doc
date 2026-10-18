'use client';

import { forgetPassword } from '@/lib/auth-client';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { ArrowLeft, CheckCircle, Loader2, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgetPassword({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to send reset link');
      } else {
        setSent(true);
        toast.success('Password reset link sent to your email');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-gradient-to-br from-background via-background-muted to-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {sent ? (
              <CheckCircle className="w-8 h-8 text-primary" />
            ) : (
              <Mail className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-space-grotesk font-bold">
            {sent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="text-muted-foreground">
            {sent
              ? `We have sent a password reset link to ${email}. Please check your inbox.`
              : 'Enter your email address and we will send you a link to reset your password.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl"
              size="lg"
              variant="hero"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
            >
              Send to another email
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link href="/signin">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
