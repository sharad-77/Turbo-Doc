import { motion } from 'framer-motion';
import { ChevronRight, Home, XCircle } from 'lucide-react';
import NextLink from 'next/link';

const CancellationPolicy = () => {
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
              At TurboDoc, we believe in flexibility and transparency. You can cancel your
              subscription at any time, with no questions asked and no cancellation fees. This
              Cancellation Policy explains how to cancel your subscription, what happens to your
              account after cancellation, and how billing is affected.
            </p>
          </section>

          {/* How to Cancel */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How to Cancel Your Subscription
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>You can cancel your TurboDoc subscription in two ways:</p>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="font-medium text-foreground mb-2">
                    Method 1: Self-Service Cancellation (Recommended)
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Log in to your TurboDoc account</li>
                    <li>
                      Navigate to{' '}
                      <span className="font-medium text-foreground">Settings → Payments</span>
                    </li>
                    <li>
                      Find your active subscription and click{' '}
                      <span className="font-medium text-foreground">
                        &ldquo;Cancel Subscription&rdquo;
                      </span>
                    </li>
                    <li>Confirm your cancellation when prompted</li>
                    <li>You&apos;ll receive a confirmation email within minutes</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">Method 2: Contact Support</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>
                      Email us at{' '}
                      <a
                        href="mailto:support@turbodoc.com"
                        className="text-primary hover:underline"
                      >
                        support@turbodoc.com
                      </a>
                    </li>
                    <li>Include your account email and subscription ID</li>
                    <li>Request cancellation</li>
                    <li>We&apos;ll process it within 24 hours and send confirmation</li>
                  </ol>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl mt-4">
                <p className="font-medium text-foreground">Important:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                  <li>No cancellation fees or penalties</li>
                  <li>Cancel anytime, even during your first billing cycle</li>
                  <li>
                    Cancellation takes effect immediately, but access continues until period end
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* What Happens After Cancellation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              What Happens After Cancellation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Once you cancel your subscription:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Immediate Confirmation:</span>{' '}
                  You&apos;ll receive an email confirming your cancellation
                </li>
                <li>
                  <span className="font-medium text-foreground">Access Until Period End:</span>{' '}
                  You&apos;ll retain Pro features until the end of your current billing period
                </li>
                <li>
                  <span className="font-medium text-foreground">No Further Charges:</span> Your
                  payment method will not be charged for subsequent billing periods
                </li>
                <li>
                  <span className="font-medium text-foreground">Automatic Downgrade:</span> At the
                  end of your billing period, your account automatically converts to the Free plan
                </li>
                <li>
                  <span className="font-medium text-foreground">File Access:</span> Your uploaded
                  files remain available according to the retention policy (30 days for Pro, then
                  deleted)
                </li>
              </ul>

              <div className="bg-accent p-4 rounded-xl mt-4">
                <p className="font-medium text-foreground">Example Timeline:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2 text-sm">
                  <li>You subscribe on January 1st (monthly billing)</li>
                  <li>You cancel on January 15th</li>
                  <li>You keep Pro access until January 31st</li>
                  <li>Starting February 1st, you&apos;re on the Free plan</li>
                  <li>No charge for February or any future months</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Billing After Cancellation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Billing After Cancellation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">Monthly Subscriptions:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Cancellation stops all future billing</li>
                <li>No prorated refunds for the current month (unless within 7-day guarantee)</li>
                <li>You keep access for the remainder of the month you paid for</li>
              </ul>

              <p className="pt-3">
                <span className="font-medium text-foreground">Yearly Subscriptions:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Cancellation stops renewal at the end of your annual period</li>
                <li>
                  Prorated refunds may be available within the first 30 days (see{' '}
                  <NextLink href="/refund-policy" className="text-primary hover:underline">
                    Refund Policy
                  </NextLink>
                  )
                </li>
                <li>Access continues for the full year you paid for</li>
              </ul>

              <div className="bg-destructive/10 p-4 rounded-xl mt-4 border border-destructive/20">
                <p className="font-medium text-destructive">
                  After Cancellation, NO charges will be made:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2 text-sm">
                  <li>Your subscription will not auto-renew</li>
                  <li>We do NOT charge cancellation fees</li>
                  <li>Your payment method is removed from auto-billing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Data Retention After Cancellation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>When you cancel and downgrade to Free plan:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Account Data:</span> Your account,
                  email, and profile information remain active
                </li>
                <li>
                  <span className="font-medium text-foreground">File Retention:</span> Files
                  uploaded during Pro period are retained for 30 days, then automatically deleted
                </li>
                <li>
                  <span className="font-medium text-foreground">Free Plan Limits:</span> Future
                  uploads follow Free plan limits (7-day retention)
                </li>
                <li>
                  <span className="font-medium text-foreground">Usage History:</span> Conversion
                  history is maintained but limited to Free plan capacity
                </li>
              </ul>

              <p className="pt-3 font-medium text-foreground">To permanently delete all data:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Go to Settings → Account → Delete Account</li>
                <li>
                  Or email{' '}
                  <a href="mailto:support@turbodoc.com" className="text-primary hover:underline">
                    support@turbodoc.com
                  </a>{' '}
                  requesting account deletion
                </li>
                <li>All files and personal data are permanently removed within 48 hours</li>
              </ul>
            </div>
          </section>

          {/* Reactivation */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Reactivating Your Subscription
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>Changed your mind? You can reactivate your Pro subscription anytime:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Log in to your TurboDoc account</li>
                <li>
                  Go to <span className="font-medium text-foreground">Settings → Payments</span>
                </li>
                <li>
                  Click{' '}
                  <span className="font-medium text-foreground">&ldquo;Upgrade to Pro&rdquo;</span>
                </li>
                <li>Select your billing cycle (monthly or yearly)</li>
                <li>Complete payment</li>
              </ol>

              <div className="bg-primary/5 p-4 rounded-xl mt-4">
                <p className="font-medium text-foreground">File Recovery:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2 text-sm">
                  <li>
                    If you reactivate within the 30-day retention period, your previous Pro files
                    remain accessible
                  </li>
                  <li>After 30 days, files are permanently deleted and cannot be recovered</li>
                  <li>New uploads after reactivation follow Pro plan retention (30 days)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Termination by TurboDoc */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Service Termination by TurboDoc
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                TurboDoc reserves the right to suspend or terminate your account under the following
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Terms Violation:</span> Breach of
                  our Terms of Service or Acceptable Use Policy
                </li>
                <li>
                  <span className="font-medium text-foreground">Fraudulent Activity:</span> Use of
                  stolen payment methods, chargebacks, or suspected fraud
                </li>
                <li>
                  <span className="font-medium text-foreground">Illegal Use:</span> Using the
                  service for illegal activities or prohibited content
                </li>
                <li>
                  <span className="font-medium text-foreground">Abuse:</span> Excessive API usage,
                  system abuse, or attempts to bypass limits
                </li>
              </ul>

              <p className="pt-3">
                <span className="font-medium text-foreground">Termination Process:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  We&apos;ll notify you via email before termination (except in cases of severe
                  abuse)
                </li>
                <li>You&apos;ll have 7 days to resolve the issue or appeal our decision</li>
                <li>If unresolved, your account will be terminated and all data deleted</li>
                <li>No refunds for terminated accounts due to policy violations</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>Have questions about cancellation? We&apos;re here to help:</p>
              <ul className="space-y-1 mt-3">
                <li>
                  <span className="font-medium text-foreground">Email:</span>{' '}
                  <a href="mailto:support@turbodoc.com" className="text-primary hover:underline">
                    support@turbodoc.com
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Response Time:</span> Within 24
                  hours
                </li>
                <li>
                  <span className="font-medium text-foreground">Support Hours:</span> Monday-Friday,
                  9 AM - 6 PM IST
                </li>
                <li>
                  <span className="font-medium text-foreground">Self-Service:</span> Cancel directly
                  from Settings → Payments
                </li>
              </ul>
              <p className="pt-3 text-sm">
                We&apos;re sad to see you go, but we understand. If you&apos;re canceling due to an
                issue with our service, please let us know so we can improve!
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
