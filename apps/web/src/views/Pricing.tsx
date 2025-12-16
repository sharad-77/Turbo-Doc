import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { Check, Crown, Headphones, Settings, Star, Zap } from 'lucide-react';

const Pricing = () => {
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
        'Basic file preview',
      ],
      limitations: ['No API access', 'No batch processing', 'Basic formats only'],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      popular: false,
      currentPlan: true,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      originalPrice: '$29',
      description: 'Ideal for professionals and small teams',
      icon: Zap,
      features: [
        'Unlimited conversions',
        'Files up to 100MB',
        'All formats supported',
        'Priority processing (5x faster)',
        'Advanced features (merge, split, watermark)',
        'API access (1000 calls/month)',
        'Priority support',
        'Advanced file preview',
        'Batch processing',
        'Custom templates',
        'Password protection',
        'Digital signatures',
      ],
      limitations: [],
      buttonText: 'Start Free Trial',
      buttonVariant: 'cta' as const,
      popular: true,
      currentPlan: false,
      discount: '34% off',
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
        '99.9% SLA guarantee',
        'White-label options',
        'On-premise deployment',
        '24/7 phone support',
        'Custom branding',
        'Advanced analytics',
        'Team management',
        'Compliance reports',
        'Priority feature requests',
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      currentPlan: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer:
        'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, Pro plan comes with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. No questions asked.',
    },
  ];

  const comparisonFeatures = [
    {
      category: 'Conversions',
      features: [
        { name: 'Daily conversions', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'File size limit', free: '10MB', pro: '100MB', enterprise: 'Unlimited' },
        { name: 'Batch processing', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Priority processing', free: '❌', pro: '5x faster', enterprise: '10x faster' },
      ],
    },
    {
      category: 'Features',
      features: [
        { name: 'Basic formats', free: '✅', pro: '✅', enterprise: '✅' },
        { name: 'Advanced formats', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Merge & Split', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Watermarks', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Password protection', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Digital signatures', free: '❌', pro: '✅', enterprise: '✅' },
      ],
    },
    {
      category: 'Support & API',
      features: [
        { name: 'Email support', free: '✅', pro: '✅', enterprise: '✅' },
        { name: 'Priority support', free: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Phone support', free: '❌', pro: '❌', enterprise: '✅' },
        { name: 'API access', free: '❌', pro: '1000 calls/month', enterprise: 'Unlimited' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-space-grotesk font-bold mb-6">
            Choose the perfect plan
            <br />
            <span className="gradient-text">for your needs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core features with different
            usage limits and advanced capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 modern-card p-2 shadow-soft">
            <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              Annual
            </button>
            <Badge variant="default" className="bg-success text-success-foreground">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative modern-card ${
                plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
              } ${plan.currentPlan ? 'ring-2 ring-success' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.currentPlan && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-space-grotesk font-bold mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-lg text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                      <Badge variant="destructive">{plan.discount}</Badge>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Not included:</h4>
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-muted-foreground">×</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* CTA Button */}
                <Button
                  variant={plan.buttonVariant}
                  size="lg"
                  className="w-full"
                  disabled={plan.currentPlan}
                >
                  {plan.currentPlan ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card className="modern-card mb-20">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-space-grotesk">
              Detailed Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left p-4">Features</th>
                    <th className="text-center p-4">Free</th>
                    <th className="text-center p-4">Pro</th>
                    <th className="text-center p-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-background-muted">
                        <td colSpan={4} className="p-4 font-semibold">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr
                          key={`feature-${categoryIndex}-${featureIndex}`}
                          className="border-b border-card-border/50"
                        >
                          <td className="p-4 text-sm">{feature.name}</td>
                          <td className="p-4 text-sm text-center">{feature.free}</td>
                          <td className="p-4 text-sm text-center">{feature.pro}</td>
                          <td className="p-4 text-sm text-center">{feature.enterprise}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-space-grotesk font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-12">
            Everything you need to know about our pricing plans
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="modern-card text-left">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="modern-card max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-2xl font-space-grotesk font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-8">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg">
                  <Headphones className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
                <Button variant="cta" size="lg">
                  <Settings className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
