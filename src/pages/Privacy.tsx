import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 text-gray-900">
          <Zap className="h-5 w-5 text-blue-600" />
          <span className="font-bold tracking-tight">AI Money Remote</span>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </header>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: April 15, 2026</p>

      <section className="space-y-6 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h2>
          <p>AI Money Remote ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Information:</strong> Email address, display name, and profile details you provide during registration.</li>
            <li><strong>Payment Information:</strong> Billing details are collected and processed directly by <strong>Stripe</strong>. We do not store your credit card numbers on our servers.</li>
            <li><strong>Content Data:</strong> Videos, scripts, hooks, and other content you create using our AI tools are stored securely to provide our services.</li>
            <li><strong>Usage Data:</strong> We may collect anonymized analytics such as pages visited and features used to improve the Platform.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide, maintain, and improve the Platform and its features.</li>
            <li>To process payments and manage your subscription.</li>
            <li>To communicate with you about your account, updates, or support requests.</li>
            <li>To ensure security and prevent fraud.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Storage &amp; Security</h2>
          <p>Your data is stored securely using industry-standard cloud infrastructure. Payment processing is handled by <strong>Stripe</strong>, which is PCI-DSS compliant. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. We Do Not Sell Your Data</h2>
          <p><strong>We do not sell, rent, or trade your personal information to third parties.</strong> Your data is used solely to provide and improve the AI Money Remote platform.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Third-Party Services</h2>
          <p>We use the following third-party services to operate the Platform:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Stripe</strong> — for secure payment processing and subscription management.</li>
            <li><strong>AI model providers</strong> — for generating content such as hooks, scripts, and visuals. Prompts are sent to AI APIs but are not used to train third-party models.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your personal data.</li>
            <li>Cancel your subscription and close your account at any time.</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at <strong>support@aimoneyremote.com</strong>.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Age Requirement</h2>
          <p>AI Money Remote is intended for users who are <strong>18 years of age or older</strong>. We do not knowingly collect personal information from anyone under 18. If we become aware that a user is under 18, we will take steps to delete their account and data.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
          <p>For questions or concerns about this Privacy Policy, please contact us at <strong>support@aimoneyremote.com</strong>.</p>
        </div>
      </section>
    </div>
  </div>
);

export default Privacy;
