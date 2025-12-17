import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Home } from 'lucide-react';
import NextLink from 'next/link';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <NextLink
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </NextLink>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Refund Policy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold">Refund Policy</h1>
              <p className="text-sm text-muted-foreground mt-1">Last updated: December 17, 2024</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-8"
        >
          {/* Overview */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              At TurboDoc, we are committed to customer satisfaction. This Refund Policy outlines the conditions under which refunds may be issued for our document conversion and processing services. We strive to be fair and transparent in all refund requests. If you have any questions about this policy, please contact our support team at support@turbodoc.com.
            </p>
          </section>

          {/* 7-Day Money-Back Guarantee */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              7-Day Money-Back Guarantee
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We offer a <span className="font-medium text-foreground">7-day money-back guarantee</span> for all new Pro plan subscriptions. If you're not satisfied with our service within the first 7 days of your subscription, you can request a full refund, no questions asked.
              </p>
              <div className="bg-primary/5 p-4 rounded-xl mt-4">
                <p className="font-medium text-foreground">To qualify for the 7-day guarantee:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                  <li>Request must be made within 7 days of initial subscription purchase</li>
                  <li>Applies to first-time Pro plan subscribers only</li>
                  <li>Full refund will be processed to your original payment method</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Eligibility */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Refund Eligibility</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Refunds may be issued in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="font-medium text-foreground">Service Downtime:</span> If our service experiences significant downtime ({">4 hours"}) affecting your ability to convert documents</li>
                <li><span className="font-medium text-foreground">Technical Issues:</span> Persistent technical problems that prevent you from using key features, despite our support team's assistance</li>
                <li><span className="font-medium text-foreground">Billing Errors:</span> Duplicate charges, incorrect subscription tier charges, or processing errors</li>
                <li><span className="font-medium text-foreground">Failed Deliverables:</span> If we failed to deliver the promised service quality (e.g., corrupted file output, failed conversions)</li>
                <li><span className="font-medium text-foreground">Within 7 Days:</span> Any reason within the first 7 days of your subscription (money-back guarantee)</li>
              </ul>
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Non-Refundable Items</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The following are not eligible for refunds:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="font-medium text-foreground">Free Plan:</span> No refunds for free tier as it doesn't involve payment</li>
                <li><span className="font-medium text-foreground">Completed Conversions:</span> Successfully processed and downloaded documents</li>
                <li><span className="font-medium text-foreground">Partial Usage:</span> Subscriptions where services have been actively used for more than 7 days</li>
                <li><span className="font-medium text-foreground">Policy Violations:</span> Accounts terminated due to Terms of Service violations</li>
                <li><span className="font-medium text-foreground">Change of Mind:</span> After the 7-day money-back guarantee period has expired</li>
                <li><span className="font-medium text-foreground">Third-Party Services:</span> Issues arising from Razorpay or other third-party payment processors</li>
              </ul>
            </div>
          </section>

          {/* Prorated Refunds */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Prorated Refunds</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                <span className="font-medium text-foreground">Monthly Subscriptions:</span> Prorated refunds are generally not offered for unused portions of monthly subscriptions. Your access continues until the end of your billing period, even after cancellation.
              </p>
              <p>
                <span className="font-medium text-foreground">Yearly Subscriptions:</span> If you cancel a yearly subscription within the first 30 days, we may offer a prorated refund for the unused months, minus the first month (non-refundable setup/onboarding fee). After 30 days, no prorated refunds will be issued.
              </p>
              <p className="bg-accent p-4 rounded-xl">
                <span className="font-medium text-foreground">Exception:</span> In cases of service failure or technical issues caused by TurboDoc, we may issue prorated refunds at our discretion.
              </p>
            </div>
          </section>

          {/* Refund Process */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How to Request a Refund
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>To request a refund, follow these steps:</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>
                  <span className="font-medium text-foreground">Contact Support:</span> Email us at <a href="mailto:support@turbodoc.com" className="text-primary hover:underline">support@turbodoc.com</a> with the subject "Refund Request"
                </li>
                <li>
                  <span className="font-medium text-foreground">Provide Details:</span> Include your account email, order/subscription ID, and reason for refund
                </li>
                <li>
                  <span className="font-medium text-foreground">Review Process:</span> Our team will review your request within 2 business days
                </li>
                <li>
                  <span className="font-medium text-foreground">Confirmation:</span> You'll receive an email with the decision and next steps
                </li>
                <li>
                  <span className="font-medium text-foreground">Processing:</span> If approved, refunds are processed within 5-7 business days
                </li>
              </ol>
            </div>
          </section>

          {/* Processing Time */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Refund Processing Time
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                Once a refund is approved, it will be processed according to the following timeline:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="font-medium text-foreground">Processing by TurboDoc:</span> 2-3 business days</li>
                <li><span className="font-medium text-foreground">Razorpay Processing:</span> 3-5 business days</li>
                <li><span className="font-medium text-foreground">Bank/Card Issuer:</span> 5-10 business days (varies by bank)</li>
              </ul>
              <p className="pt-3">
                <span className="font-medium text-foreground">Total Time:</span> You should expect to see the refund in your account within <span className="font-medium text-foreground">10-15 business days</span> from approval. The refund will appear in the same payment method used for the original purchase.
              </p>
              <p className="bg-accent p-4 rounded-xl mt-4">
                If you don't receive your refund within this timeframe, please contact your bank or Razorpay support. We'll provide transaction IDs to help track the refund.
              </p>
            </div>
          </section>

          {/* Subscription Downgrades */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Subscription Downgrades</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p>
                If you downgrade from Pro to Free plan:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>No refund for unused portion of the billing period</li>
                <li>You'll retain Pro features until the end of your current billing cycle</li>
                <li>After that, your account automatically converts to Free plan</li>
                <li>No charges will be made for subsequent billing periods</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>
                For refund requests or questions about this policy:
              </p>
              <ul className="space-y-1 mt-3">
                <li><span className="font-medium text-foreground">Email:</span> <a href="mailto:support@turbodoc.com" className="text-primary hover:underline">support@turbodoc.com</a></li>
                <li><span className="font-medium text-foreground">Subject Line:</span> "Refund Request" for faster processing</li>
                <li><span className="font-medium text-foreground">Response Time:</span> Within 24-48 hours</li>
                <li><span className="font-medium text-foreground">Support Hours:</span> Monday-Friday, 9 AM - 6 PM IST</li>
              </ul>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
