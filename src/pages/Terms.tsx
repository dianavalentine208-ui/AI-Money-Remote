import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => (
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: April 15, 2026</p>

      <section className="space-y-6 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using AI Money Remote ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Eligibility</h2>
          <p>You must be at least <strong>18 years of age</strong> to create an account or use any features of AI Money Remote. By using the Platform, you represent and warrant that you meet this age requirement.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. AI Content Ownership</h2>
          <p>You retain full ownership of all scripts, videos, hooks, and other content you create using the Platform's AI tools. However, <strong>AI Money Remote is not responsible for how you use your "Digital Twin"</strong> or any AI-generated content. You are solely responsible for ensuring your use of generated content complies with all applicable laws, platform guidelines, and third-party rights.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Subscriptions &amp; Billing</h2>
          <p>AI Money Remote offers paid plans including a recurring Pro subscription ($29/month) and a one-time 30-Day Launchpad purchase ($97). All payments are processed securely through <strong>Stripe</strong>.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Subscriptions renew automatically at the end of each billing cycle unless cancelled.</li>
            <li>You may cancel your subscription at any time via the Billing portal. Access continues until the end of your current billing period.</li>
            <li>The 30-Day Launchpad is a one-time purchase and is non-recurring.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Refund Policy</h2>
          <p>Due to the digital nature of our products and the immediate access granted upon purchase, <strong>all sales are final and non-refundable</strong>. We encourage you to review our Pricing page and take advantage of any free-tier features before committing to a paid plan. If you experience a technical issue preventing access to a paid feature, please contact support.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Prohibited Use</h2>
          <p>You agree not to use the Platform to create content that is defamatory, fraudulent, infringing, or otherwise illegal. We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h2>
          <p>AI Money Remote is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform, including but not limited to lost revenue from AI-generated content.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to the Service</h2>
          <p>We may modify, suspend, or discontinue any part of the Platform at any time. We will make reasonable efforts to notify users of significant changes.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
          <p>For questions about these Terms, please reach out to us at <strong>support@aimoneyremote.com</strong>.</p>
        </div>
      </section>
    </div>
  </div>
);

export default Terms;
