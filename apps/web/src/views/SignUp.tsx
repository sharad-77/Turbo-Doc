'use client';

import { authClient } from '@/lib/auth-client';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  ArrowRight,
  CheckCircle,
  Chrome,
  Eye,
  EyeOff,
  FileText,
  Github,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: '/dashboard',
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success('Account created successfully');
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

  const features = [
    {
      icon: CheckCircle,
      text: 'Convert unlimited documents',
    },
    {
      icon: Shield,
      text: 'Enterprise-grade security',
    },
    {
      icon: Zap,
      text: 'Lightning-fast processing',
    },
  ];

  return (
    <div className="min-h-svh flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background-muted to-primary/5 items-center justify-center p-8">
        <div className="max-w-md space-y-8">
          <div className="text-center">
            <div className="modern-card p-8 animate-float">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <FileText className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-space-grotesk font-bold mb-4">Join 50,000+ Users</h2>
              <p className="text-muted-foreground mb-6">
                Start your journey with Document Toolkit and experience the future of document
                processing.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-primary/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            <h1 className="text-2xl md:text-3xl font-space-grotesk font-bold mb-2">
              Create your account
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Get started with your free account today
            </p>
          </div>

          {/* Social Sign Up */}
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

          {/* Sign Up Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 h-10 md:h-12 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-10 md:h-12 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          className="pl-10 pr-10 h-10 md:h-12 rounded-xl"
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
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm text-muted-foreground !mt-0">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:text-primary-hover">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:text-primary-hover">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-xl"
                size="lg"
                variant="hero"
                disabled={!form.getValues('agreeToTerms') || loading}
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          </Form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
