import { motion } from 'framer-motion';
import { ChevronRight, Home, Shield } from 'lucide-react';
import NextLink from 'next/link';

const PrivacyPolicy = () => {
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
            <span className="text-foreground">Privacy Policy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold">Privacy Policy</h1>
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
          {/* Introduction */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              TurboDoc (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our document conversion and processing
              services. By using TurboDoc, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                We collect the following types of information:
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">Personal Information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                    <li>Name, email address, and phone number when you create an account</li>
                    <li>
                      Billing address and payment information (processed securely through Razorpay)
                    </li>
                    <li>Account credentials (encrypted passwords)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">Files and Documents:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                    <li>
                      Documents and images you upload for conversion, merging, splitting, or
                      compression
                    </li>
                    <li>File metadata (file name, size, format)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">Usage Data:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                    <li>Browser type, device information, and operating system</li>
                    <li>IP address and approximate location</li>
                    <li>Service usage statistics (features used, conversion history)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To provide, operate, and maintain our document conversion services</li>
                <li>To process your documents (convert, merge, split, compress)</li>
                <li>To manage your account and subscription</li>
                <li>To process payments and prevent fraudulent transactions</li>
                <li>To send service-related notifications and updates</li>
                <li>To improve our services through analytics and user feedback</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>
                  To send marketing communications (with your consent, you can opt-out anytime)
                </li>
                <li>To comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Data Security</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">AES-256 Encryption:</span> All
                  uploaded files are encrypted during storage on AWS S3
                </li>
                <li>
                  <span className="font-medium text-foreground">HTTPS/TLS:</span> All data
                  transmission is encrypted using SSL/TLS protocols
                </li>
                <li>
                  <span className="font-medium text-foreground">Automatic File Deletion:</span>{' '}
                  Uploaded files are automatically deleted from our servers after the retention
                  period (7 days for Free plan, 30 days for Pro plan)
                </li>
                <li>
                  <span className="font-medium text-foreground">Secure Payment Processing:</span>{' '}
                  Payment information is handled by Razorpay, a PCI-DSS compliant payment gateway.
                  We do not store credit card details
                </li>
                <li>
                  <span className="font-medium text-foreground">Access Controls:</span> Strict
                  access controls ensure only authorized personnel can access sensitive data
                </li>
              </ul>
              <p className="pt-2">
                While we strive to protect your data, no method of transmission over the Internet or
                electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* File Retention */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              File Retention and Deletion
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Free Plan:</span> Files are retained
                  for 7 days after upload, then permanently deleted
                </li>
                <li>
                  <span className="font-medium text-foreground">Pro Plan:</span> Files are retained
                  for 30 days after upload, then permanently deleted
                </li>
                <li>
                  <span className="font-medium text-foreground">Manual Deletion:</span> You can
                  delete your files at any time from your dashboard
                </li>
                <li>
                  <span className="font-medium text-foreground">Account Deletion:</span> If you
                  delete your account, all associated files are immediately removed from our servers
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Third-Party Services</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Razorpay:</span> For secure payment
                  processing. View their{' '}
                  <a
                    href="https://razorpay.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">AWS S3:</span> For secure file
                  storage. View their{' '}
                  <a
                    href="https://aws.amazon.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Analytics:</span> We may use
                  analytics tools to understand usage patterns and improve our service
                </li>
              </ul>
              <p className="pt-2">
                These third parties have access to your information only to perform specific tasks
                on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Cookies and Tracking</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>We use cookies and similar tracking technologies to enhance your experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Essential Cookies:</span> Required
                  for authentication and basic functionality
                </li>
                <li>
                  <span className="font-medium text-foreground">Analytics Cookies:</span> Help us
                  understand how users interact with our service
                </li>
                <li>
                  <span className="font-medium text-foreground">Preference Cookies:</span> Remember
                  your settings and preferences
                </li>
              </ul>
              <p className="pt-2">
                You can control cookies through your browser settings. Disabling certain cookies may
                affect website functionality.
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Your Rights</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-medium text-foreground">Right to Access:</span> Request a
                  copy of your personal data
                </li>
                <li>
                  <span className="font-medium text-foreground">Right to Rectification:</span>{' '}
                  Correct inaccurate or incomplete data
                </li>
                <li>
                  <span className="font-medium text-foreground">Right to Erasure:</span> Request
                  deletion of your account and all associated data
                </li>
                <li>
                  <span className="font-medium text-foreground">Right to Data Portability:</span>{' '}
                  Receive your data in a structured, machine-readable format
                </li>
                <li>
                  <span className="font-medium text-foreground">Right to Object:</span> Object to
                  processing of your data for marketing purposes
                </li>
                <li>
                  <span className="font-medium text-foreground">Right to Withdraw Consent:</span>{' '}
                  Withdraw consent for data processing at any time
                </li>
              </ul>
              <p className="pt-2">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@turbodoc.com" className="text-primary hover:underline">
                  privacy@turbodoc.com
                </a>
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TurboDoc is not intended for use by children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe a child has
              provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &ldquo;Last updated&rdquo;
              date. You are advised to review this Privacy Policy periodically for any changes.
              Continued use of our service after changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>
                If you have questions about this Privacy Policy or your data, please contact us:
              </p>
              <ul className="space-y-1 mt-3">
                <li>
                  <span className="font-medium text-foreground">Email:</span>{' '}
                  <a href="mailto:privacy@turbodoc.com" className="text-primary hover:underline">
                    privacy@turbodoc.com
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Support:</span>{' '}
                  <a href="mailto:support@turbodoc.com" className="text-primary hover:underline">
                    support@turbodoc.com
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Response Time:</span> Within 48
                  hours for privacy-related inquiries
                </li>
              </ul>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
