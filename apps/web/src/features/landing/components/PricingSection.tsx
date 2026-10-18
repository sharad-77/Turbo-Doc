'use client';

import { usePlansQuery, type SubscriptionPlan } from '@/api';
import { Button } from '@repo/ui/components/ui/button';
import { Check, Loader2, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PricingSection = () => {
  const router = useRouter();

  const { data: plans = [], isLoading } = usePlansQuery();

  const getPlanIcon = (name: string) => {
    if (name === 'FREE') return Star;
    if (name === 'PRO') return Zap;
    return Star;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice === 0) return { display: '₹0', period: 'forever' };
    return { display: `₹${numPrice}`, period: 'per month' };
  };

  const handleGetStarted = (planId: string, planName: string) => {
    if (planName === 'FREE') {
      router.push('/signup');
    } else {
      router.push(`/payments?planId=${planId}`);
    }
  };

  if (isLoading) {
    return (
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-muted">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-muted">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-space-grotesk font-bold mb-4">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan: SubscriptionPlan) => {
            const PlanIcon = getPlanIcon(plan.name);
            const { display: priceDisplay, period } = formatPrice(plan.price);
            const isPro = plan.name === 'PRO';
            const features = plan.features || [];

            return (
              <div
                key={plan.id}
                className={`relative feature-card ${isPro ? 'ring-2 ring-primary' : ''}`}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center ${isPro ? 'bg-primary text-primary-foreground' : 'text-primary'}`}
                  >
                    <PlanIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-space-grotesk font-bold mb-2">{plan.displayName}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{priceDisplay}</span>
                    <span className="text-muted-foreground ml-2">/{period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant={isPro ? 'cta' : 'outline'}
                  size="lg"
                  className="w-full"
                  onClick={() => handleGetStarted(plan.id, plan.name)}
                >
                  {isPro ? 'Upgrade to Pro' : 'Get Started Free'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
