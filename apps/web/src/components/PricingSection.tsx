import { Button } from '@repo/ui/components/ui/button';
import { Check, Crown, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and light document processing',
    icon: Star,
    features: [
      '5 conversions per day',
      'Files up to 10MB',
      'Basic formats (PDF, Word, JPG)',
      'Standard processing speed',
      'Email support',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Ideal for professionals and small teams',
    icon: Zap,
    features: [
      'Unlimited conversions',
      'Files up to 100MB',
      'All formats supported',
      'Priority processing',
      'Advanced features (merge, split, watermark)',
      'API access',
      'Priority support',
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'cta' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations with custom requirements',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Unlimited file sizes',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'White-label options',
      'On-premise deployment',
      '24/7 phone support',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
  },
];

export const PricingSection = () => {
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

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-background rounded-2xl p-2 shadow-soft">
            <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              Annual
            </button>
            <span className="bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative feature-card ${plan.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center ${plan.popular ? 'bg-primary text-primary-foreground' : 'text-primary'}`}
                >
                  <plan.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-space-grotesk font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button variant={plan.buttonVariant} size="lg" className="w-full">
                {plan.buttonText}
              </Button>
            </div>
          ))}
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
