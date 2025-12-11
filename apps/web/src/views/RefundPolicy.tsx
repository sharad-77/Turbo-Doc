import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link
              to="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
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
              <p className="text-sm text-muted-foreground mt-1">Last updated: December 2024</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              [PLACEHOLDER: Provide an overview of your refund policy. State your commitment to
              customer satisfaction and the general conditions under which refunds are provided.]
            </p>
          </section>

          {/* Eligibility */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Refund Eligibility</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Define who is eligible for refunds]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Subscription refunds within [X] days of purchase</li>
                <li>Service not delivered as promised</li>
                <li>Technical issues preventing service use</li>
                <li>Duplicate charges or billing errors</li>
              </ul>
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Non-Refundable Items</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: List items/services that are not eligible for refund]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Successfully completed document conversions</li>
                <li>Partially used subscription periods (after [X] days)</li>
                <li>Services used in violation of terms</li>
              </ul>
            </div>
          </section>

          {/* Refund Process */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How to Request a Refund
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Explain the refund request process]</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Contact our support team at [email]</li>
                <li>Provide your order/subscription ID</li>
                <li>Explain the reason for your refund request</li>
                <li>Wait for confirmation (typically within [X] business days)</li>
              </ol>
            </div>
          </section>

          {/* Processing Time */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Refund Processing Time
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Specify refund processing times. Mention that refunds are processed
              through Razorpay and the typical timeframe for funds to appear in the customer&apos;s
              account (usually 5-10 business days).]
            </p>
          </section>

          {/* Partial Refunds */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Partial Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Explain conditions under which partial refunds may be issued, such as
              prorated refunds for unused subscription periods.]
            </p>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Provide contact information for refund requests. Include email address,
              support hours, and expected response time.]
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
