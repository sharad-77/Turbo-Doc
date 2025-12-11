import { motion } from 'framer-motion';
import { Shield, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          {/* Introduction */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Insert your company introduction here. Explain who you are and the
              purpose of this privacy policy. This section should establish trust with your users
              and explain your commitment to protecting their data.]
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Describe the types of information you collect]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Files uploaded for document conversion</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Explain how you use the collected information]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To provide document conversion services</li>
                <li>To process payments and maintain accounts</li>
                <li>To improve our services and user experience</li>
                <li>To communicate with you about updates and offers</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Describe your security measures. Explain how you protect user data,
              including encryption methods, secure servers, and data handling practices. Mention
              that files are automatically deleted after processing.]
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: List third-party services you use, such as Razorpay for payments,
              analytics tools, etc. Explain what data is shared with these services and link to
              their privacy policies.]
            </p>
          </section>

          {/* User Rights */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Your Rights</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>[PLACEHOLDER: Explain user rights regarding their data]</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your account and data</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-space-grotesk font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER: Provide contact information for privacy-related inquiries. Include email
              address, physical address if applicable, and response time expectations.]
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
