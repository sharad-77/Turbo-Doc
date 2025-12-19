'use client';

import { getPlans, type SubscriptionPlan } from '@/api/plans';
import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Check, Loader2, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PricingSection = () => {
  const router = useRouter();

  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[], Error>({
    queryKey: ['subscription-plans'],
    queryFn: getPlans,
  });

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
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-muted">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk font-bold mb-6">
            Simple, transparent
            <br />
            <span className="text-primary">pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map(plan => {
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
                  {features.map((feature, idx) => (
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
                  {plan.name === 'FREE' ? 'Get Started' : 'Upgrade to Pro'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include SSL encryption, GDPR compliance, and automatic backups.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              No setup fees
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
