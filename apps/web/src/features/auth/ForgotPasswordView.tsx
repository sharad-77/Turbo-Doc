'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { ArrowLeft, CheckCircle, Loader2, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useForgotPassword } from './hooks/useForgotPassword';

export function ForgotPasswordView() {
  const { state, actions } = useForgotPassword();
  const { email, loading, sent } = state;

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
          <form onSubmit={actions.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => actions.setEmail(e.target.value)}
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
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => actions.setEmail('')}
            >
              Try another email
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
