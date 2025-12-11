import { Navigation } from '@/components/Navigation';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 19,
    period: 'month',
    features: ['Unlimited conversions', 'Priority support', 'API access'],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: 190,
    period: 'year',
    savings: 'Save $38',
    features: ['Unlimited conversions', 'Priority support', 'API access', '2 months free'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: ['Custom integrations', 'Dedicated support', 'White-label options'],
  },
];

const paymentHistory = [
  {
    id: '1',
    date: '2024-01-15',
    plan: 'Pro Monthly',
    amount: 19,
    status: 'paid',
    invoice: 'INV-2024-001',
  },
  {
    id: '2',
    date: '2023-12-15',
    plan: 'Pro Monthly',
    amount: 19,
    status: 'paid',
    invoice: 'INV-2023-012',
  },
  {
    id: '3',
    date: '2023-11-15',
    plan: 'Pro Monthly',
    amount: 19,
    status: 'paid',
    invoice: 'INV-2023-011',
  },
];

export default function Payments() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRazorpayPayment = async (plan: (typeof plans)[0]) => {
    setIsProcessing(true);

    try {
      // Initialize Razorpay (in real implementation, load from CDN)
      /* const options = {
        key: 'rzp_test_your_key_here', // Replace with your Razorpay key
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        name: 'Document Toolkit',
        description: `Subscription to ${plan.name}`,
        image: '/favicon.ico',
        order_id: `order_${Date.now()}`, // Generate from backend
        handler: function (response: any) {
          console.log('Payment successful:', response);
          // Handle successful payment
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999',
        },
        notes: {
          plan_id: plan.id,
          user_id: 'user_123',
        },
        theme: {
          color: 'hsl(220, 85%, 45%)',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      }; */

      // In real implementation, you would load Razorpay SDK
      // const rzp = new window.Razorpay(options);
      // rzp.open();

      // For demo purposes, simulate payment
      setTimeout(() => {
        setIsProcessing(false);
        alert(`Demo: Payment initiated for ${plan.name} - $${plan.price}`);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

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
                      <h3 className="text-xl font-semibold mb-2 text-primary">Pro Monthly</h3>
                      <p className="text-muted-foreground mb-4">$19 per month</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-success" />
                        <span>Next billing: February 15, 2024</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </div>
                      <div>
                        <Button variant="cta" size="sm">
                          Manage Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Plans */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-primary">Upgrade Your Plan</CardTitle>
                  <CardDescription>Choose a plan that fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                      <div
                        key={plan.id}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedPlan === plan.id
                            ? 'border-primary bg-primary/5'
                            : 'border-card-border hover:border-primary/30'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.savings && (
                          <div className="absolute -top-3 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            {plan.savings}
                          </div>
                        )}

                        <div className="text-center mb-4">
                          <h3 className="font-semibold mb-2">{plan.name}</h3>
                          <div className="mb-2">
                            <span className="text-2xl font-bold">${plan.price}</span>
                            <span className="text-muted-foreground">/{plan.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-2 text-sm mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant={selectedPlan === plan.id ? 'cta' : 'outline'}
                          className="w-full"
                          onClick={e => {
                            e.stopPropagation();
                            handleRazorpayPayment(plan);
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

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>Your recent transactions and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory.map(payment => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border border-card-border rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.plan}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${payment.amount}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                              Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
