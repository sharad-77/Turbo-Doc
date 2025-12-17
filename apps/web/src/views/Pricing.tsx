'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { ArrowRight, Check, Clock, Minus, Shield, Zap } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATIC_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying out Turbo-Doc with basic needs.',
    features: [
      '5 document conversions/day',
      '5 image conversions/day',
      '2 file merges/day',
      '200MB storage',
      '7-day retention',
    ],
    highlight: false,
    buttonText: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: { monthly: 249, yearly: 199 },
    description: 'For professionals who need more power and speed.',
    features: [
      '20 document conversions/day',
      '20 image conversions/day',
      'Unlimited file merges',
      '500MB storage',
      '30-day retention',
      'Priority Support',
      'No Watermarks',
    ],
    highlight: true,
    buttonText: 'Upgrade to Pro',
  },
];

// Feature Comparison Data
const COMPARISON_DATA = [
  {
    category: 'Usage Limits',
    features: [
      { name: 'Daily Documents', free: '5', pro: '20' },
      { name: 'Daily Images', free: '5', pro: '20' },
      { name: 'File Merges', free: '2/day', pro: 'Unlimited' },
    ],
  },
  {
    category: 'Storage',
    features: [
      { name: 'Max Storage', free: '200MB', pro: '500MB' },
      { name: 'File Retention', free: '7 Days', pro: '30 Days' },
    ],
  },
  {
    category: 'Professional Tools',
    features: [
      { name: 'Priority Support', free: false, pro: true },
      { name: 'No Watermarks', free: false, pro: true },
      { name: 'Batch Processing', free: false, pro: true },
    ],
  },
];

const Pricing = () => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanAction = (planId: string) => {
    const route =
      planId === 'free' ? '/signup' : `/payments?planId=${planId}&cycle=${billingCycle}`;
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <Badge
            variant="outline"
            className="px-4 py-1 border-primary/30 text-primary bg-primary/5 rounded-full"
          >
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
            Ready to <span className="text-primary">scale?</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose the perfect plan for your document workflow. Save up to 20% with yearly billing.
          </p>

          <div className="flex justify-center pt-10 pb-4">
            <div className="relative group">
              {/* The Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              <Tabs
                defaultValue="monthly"
                className="relative w-[320px] bg-background/50 backdrop-blur-md border border-primary/20 p-1.5 rounded-full shadow-xl"
                onValueChange={v => setBillingCycle(v as any)}
              >
                <TabsList className="grid w-full grid-cols-2 h-11 rounded-full bg-transparent border-none">
                  <TabsTrigger
                    value="monthly"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="relative rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Yearly
                    <span className="absolute -top-3 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-[10px] font-bold text-white px-2.5 py-1 rounded-full border-2 border-background shadow-lg animate-pulse">
                      SAVE 20%
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          {STATIC_PLANS.map(plan => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 hover:translate-y-[-4px] ${
                plan.highlight
                  ? 'border-primary shadow-2xl shadow-primary/10 bg-card'
                  : 'bg-card/50 backdrop-blur-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute inset-x-0 -top-4 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}

              <CardHeader className="space-y-2 pt-10 text-center md:text-left">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-4xl font-bold">₹{plan.price[billingCycle]}</span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-4 pt-4">
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pb-8">
                <Button
                  onClick={() => handlePlanAction(plan.id)}
                  variant={plan.highlight ? 'default' : 'outline'}
                  className={`w-full h-12 text-md font-semibold transition-all ${
                    plan.highlight ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40' : ''
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* --- DETAILED COMPARISON SECTION --- */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Compare Plan Features</h2>
            <p className="text-muted-foreground mt-2">Find the right balance for your workflow</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-5 px-6 text-sm font-semibold text-foreground">
                      Plan Features
                    </th>
                    <th className="py-5 px-6 text-sm font-semibold text-center w-[200px]">Free</th>
                    <th className="py-5 px-6 text-sm font-semibold text-center w-[200px] bg-primary/5">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      <tr className="bg-muted/20">
                        <td
                          colSpan={3}
                          className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-primary"
                        >
                          {group.category}
                        </td>
                      </tr>
                      {group.features.map((feature, fIdx) => (
                        <tr
                          key={fIdx}
                          className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                        >
                          <td className="py-4 px-6 text-sm font-medium text-muted-foreground">
                            {feature.name}
                          </td>
                          <td className="py-4 px-6 text-sm text-center">
                            {typeof feature.free === 'boolean' ? (
                              feature.free ? (
                                <Check className="mx-auto h-5 w-5 text-green-500" />
                              ) : (
                                <Minus className="mx-auto h-5 w-5 text-muted-foreground/30" />
                              )
                            ) : (
                              <span className="font-medium">{feature.free}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-center bg-primary/5">
                            {typeof feature.pro === 'boolean' ? (
                              feature.pro ? (
                                <Check className="mx-auto h-5 w-5 text-primary" />
                              ) : (
                                <Minus className="mx-auto h-5 w-5 text-muted-foreground/30" />
                              )
                            ) : (
                              <span className="font-bold text-foreground">{feature.pro}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Value Props Section */}
        <div className="mt-24 max-w-5xl mx-auto hidden md:block border-t border-border pt-24">
          <div className="grid grid-cols-3 gap-12 text-center">
            <div className="space-y-3">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Fast Processing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Files processed in seconds via global edge network.
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Secure Storage</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AES-256 encryption for all your documents.
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Priority Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                24/7 dedicated support for pro members.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-24 text-center text-sm text-muted-foreground bg-muted/30 py-8 rounded-2xl border border-dashed">
          <p className="font-medium">
            Secure payment via Razorpay. Cancel anytime. Prices include GST.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <NextLink href="/pricing" className="hover:text-primary transition-colors">
              FAQ
            </NextLink>
            <NextLink href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </NextLink>
            <NextLink href="/refund-policy" className="hover:text-primary transition-colors">
              Refund Policy
            </NextLink>
            <NextLink href="/cancellation-policy" className="hover:text-primary transition-colors">
              Cancellation Policy
            </NextLink>
            <NextLink href="/contact" className="hover:text-primary transition-colors font-semibold">
              Contact Support
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple import fix for React.Fragment if not globally available
import React from 'react';

export default Pricing;
