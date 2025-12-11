import { motion } from 'framer-motion';
import { ChevronRight, Home, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CancellationPolicy = () => {
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
            <span className="text-foreground">Cancellation Policy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold">
                Cancellation Policy
              </h1>
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
              [PLACEHOLDER: Provide an overview of your cancellation policy. Explain that customers
              can cancel their subscription at any time and what happens to their account after
              cancellation.]
            </p>
          </section>

          {/* How to Cancel */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How to Cancel Your Subscription
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Provide step-by-step cancellation instructions]</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Log in to your TurboDoc account</li>
                <li>Navigate to Settings → Billing</li>
                <li>Click &quot;Cancel Subscription&quot;</li>
                <li>Confirm your cancellation</li>
                <li>You&apos;ll receive a confirmation email</li>
              </ol>
            </div>
          </section>

          {/* What Happens After Cancellation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              What Happens After Cancellation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Explain post-cancellation access and data handling]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Access continues until end of billing period</li>
                <li>Your data remains available for [X] days</li>
                <li>You can download your files before deletion</li>
                <li>After [X] days, all data is permanently deleted</li>
              </ul>
            </div>
          </section>

          {/* Billing After Cancellation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Billing After Cancellation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Explain billing after cancellation]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>No further charges after cancellation confirmation</li>
                <li>Current billing period access maintained</li>
                <li>No prorated refunds for partial months (unless specified)</li>
              </ul>
            </div>
          </section>

          {/* Reactivation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Reactivating Your Account
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Explain how users can reactivate their subscription. Include information
              about whether their previous data will be available if they reactivate within the data
              retention period.]
            </p>
          </section>

          {/* Free Trial Cancellation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Free Trial Cancellation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Explain free trial cancellation terms. State that users can cancel
              during the trial period without being charged and how to cancel before the trial
              ends.]
            </p>
          </section>

          {/* Service Termination by TurboDoc */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Service Termination by TurboDoc
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Explain circumstances under which TurboDoc may terminate service, such
              as violation of terms of service, fraudulent activity, or non-payment. Include any
              notice period provided before termination.]
            </p>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Provide contact information for cancellation-related questions. Include
              email address, support hours, and expected response time.]
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
