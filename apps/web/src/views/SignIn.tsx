'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  FileText,
  Github,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: '/dashboard',
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success('Signed in successfully');
            router.push('/dashboard');
          },
          onError: ctx => {
            toast.error(ctx.error.message);
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard',
    });
  };

  return (
    <div className="min-h-svh flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6 md:space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-xl md:text-2xl font-space-grotesk font-bold gradient-text">
                Document Toolkit
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-space-grotesk font-bold mb-2">Welcome back</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3 md:space-y-4">
            <Button
              variant="outline"
              className="w-full h-10 md:h-12 rounded-xl"
              size="lg"
              onClick={() => handleSocialSignIn('github')}
            >
              <Github className="w-4 h-4 md:w-5 md:h-5 mr-3" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 md:h-12 rounded-xl"
              size="lg"
              onClick={() => handleSocialSignIn('google')}
            >
              <Chrome className="w-4 h-4 md:w-5 md:h-5 mr-3" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 h-10 md:h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs md:text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 md:h-12 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl"
              size="lg"
              variant="hero"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background-muted to-primary/5 items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="relative">
            <div className="modern-card p-8 animate-float">
              <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-space-grotesk font-semibold mb-4">
                Transform Documents Effortlessly
              </h3>
              <p className="text-muted-foreground">
                Join thousands of professionals who trust Document Toolkit for their document
                processing needs.
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-primary/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
