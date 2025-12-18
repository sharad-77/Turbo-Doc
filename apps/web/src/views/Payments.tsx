'use client';

import { createPlanOrder, getPlans, getUserPlan, verifyPayment } from '@/api/plans';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Declare Razorpay type
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function Payments() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch all plans from backend
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: getPlans,
  });

  // Fetch user's current plan
  const { data: userPlan } = useQuery({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle payment for selected plan
  const handleRazorpayPayment = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // Don't allow payment for FREE plan
    if (plan.name === 'FREE') {
      toast.error('Free plan does not require payment');
      router.push('/signup');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order from backend
      const order = await createPlanOrder(planId);

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Turbo-Doc',
        description: `${plan.displayName} Subscription`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.status === 'SUCCESS') {
              toast.success('Payment successful! Your subscription is now active.', {
                duration: 5000,
              });
              // Refresh to show updated plan
              window.location.reload();
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-space-grotesk font-bold mb-6 gradient-text">
              Billing & Payments
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your subscription, payment methods, and billing history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan & Upgrade */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Subscription */}
              <Card className="modern-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Current Subscription
                  </CardTitle>
                  <CardDescription>Your current plan and billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-primary/10 rounded-2xl border border-primary/20">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-primary">
                        {userPlan?.displayName || 'Free Plan'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        ₹{parseFloat(userPlan?.price || '0')} per month
                      </p>
                      {userPlan?.name === 'PRO' && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-success" />
                          <span>Subscription active</span>
                        </div>
                      )}
                      {userPlan?.name === 'FREE' && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            {userPlan?.dailyDocumentLimit || 5} document conversions/day
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <CheckCircle className="w-4 h-4" />
                        {userPlan?.name === 'PRO' ? 'Pro' : 'Active'}
                      </div>
                      <div>
                        {userPlan?.name !== 'PRO' && (
                          <Button
                            variant="cta"
                            size="sm"
                            onClick={() => {
                              const proPlan = plans.find(p => p.name === 'PRO');
                              if (proPlan) {
                                setSelectedPlanId(proPlan.id);
                                // Scroll to plans section
                                document
                                  .getElementById('upgrade-plans')
                                  ?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            Upgrade to Pro
                          </Button>
                        )}
                        {userPlan?.name === 'PRO' && (
                          <Button variant="outline" size="sm">
                            Manage Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Plans */}
              <Card className="modern-card" id="upgrade-plans">
                <CardHeader>
                  <CardTitle className="text-primary">Upgrade Your Plan</CardTitle>
                  <CardDescription>Choose a plan that fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans
                      .filter(p => p.name !== 'FREE')
                      .map(plan => (
                        <div
                          key={plan.id}
                          className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedPlanId === plan.id
                              ? 'border-primary bg-primary/5'
                              : 'border-card-border hover:border-primary/30'
                          }`}
                          onClick={() => setSelectedPlanId(plan.id)}
                        >
                          {plan.name === 'PRO' && (
                            <div className="absolute -top-3 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              Recommended
                            </div>
                          )}

                          <div className="mb-4">
                            <h3 className="font-semibold text-xl mb-2">{plan.displayName}</h3>
                            <div className="mb-3">
                              <span className="text-3xl font-bold">₹{parseFloat(plan.price)}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                          </div>

                          {/* Plan Limits */}
                          <div className="space-y-2 mb-4 pb-4 border-b border-border">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Daily Documents</span>
                              <span className="font-medium">{plan.dailyDocumentLimit}/day</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Daily Images</span>
                              <span className="font-medium">{plan.dailyImageLimit}/day</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Storage</span>
                              <span className="font-medium">{plan.storageLimitMB}MB</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">File Retention</span>
                              <span className="font-medium">{plan.retentionDays} days</span>
                            </div>
                          </div>

                          {/* Plan Features */}
                          <ul className="space-y-2 text-sm mb-6">
                            {plan.features &&
                              plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                          </ul>

                          <Button
                            variant={selectedPlanId === plan.id ? 'cta' : 'outline'}
                            className="w-full"
                            onClick={e => {
                              e.stopPropagation();
                              handleRazorpayPayment(plan.id);
                            }}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Subscribe'}
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment History - Commented out for now, can be added later with real data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>Your recent transactions and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No payment history available yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods & Security */}
            <div className="space-y-8">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-card-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Your payments are secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-success/5 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-sm">SSL Encrypted</p>
                        <p className="text-xs text-muted-foreground">All payments are encrypted</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-success/5 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-sm">PCI Compliant</p>
                        <p className="text-xs text-muted-foreground">Secure payment processing</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Razorpay Powered</p>
                        <p className="text-xs text-muted-foreground">Trusted payment gateway</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Billing FAQ
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Info
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
