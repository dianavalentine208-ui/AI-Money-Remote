import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Zap, LifeBuoy, Send, MessageCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "Go to Settings → Manage Subscription → Cancel Plan. You'll keep access until the end of your billing period. You can also manage your subscription directly from the Stripe billing portal.",
  },
  {
    q: "Can I get a refund?",
    a: "We do not offer refunds on subscription payments or the 30-Day Launchpad purchase. You can cancel anytime and retain access until the end of your current billing period.",
  },
  {
    q: "What happens to my Digital Twin if I cancel?",
    a: "Your Persona Clone data is stored securely. If you resubscribe, your Digital Twin will still be there. However, you won't be able to generate new content while unsubscribed.",
  },
  {
    q: "How does the 30-Day Launchpad work?",
    a: "It's a one-time $97 purchase that gives you a guided 30-day roadmap to launch your faceless content channel. Your progress is saved automatically — pick up right where you left off.",
  },
  {
    q: "I'm not tech-savvy. Is this tool for me?",
    a: "Absolutely! AI Money Remote is designed for creators aged 35+ who want simple, one-click tools. No coding or video editing experience required.",
  },
  {
    q: "How do I update my payment method?",
    a: "Go to Settings → Manage Subscription. This opens the Stripe billing portal where you can update your credit card or payment method securely.",
  },
];

const Support = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    // Mailto fallback — opens user's email client
    const mailtoBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
    const mailtoLink = `mailto:wealthmadesimple@consultant.com?subject=${encodeURIComponent(subject || "Support Request")}&body=${encodeURIComponent(mailtoBody)}`;
    window.open(mailtoLink, "_blank");
    toast.success("Your email client has been opened. Send the message to complete your request.");
    setSending(false);
  };

  const handleTechIssue = () => {
    const body = `Hi Support,\n\nI'm experiencing a technical issue.\n\nBrowser: ${navigator.userAgent}\nPage: ${window.location.href}\nUser: ${user?.email || "Not signed in"}\n\nPlease describe the issue below:\n\n`;
    const mailtoLink = `mailto:wealthmadesimple@consultant.com?subject=${encodeURIComponent("Technical Issue Report")}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border/30 glass-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">AI Money Remote</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="sm">Settings</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-10 px-4 max-w-2xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LifeBuoy className="h-7 w-7 text-primary" /> Help & Support
          </h1>
          <p className="text-muted-foreground mt-1">We're here to help. Find answers or reach out directly.</p>
        </div>

        {/* Emergency Tech Button */}
        <section className="glass-card rounded-lg p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-destructive mt-0.5 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">Having a technical issue?</h2>
                <p className="text-sm text-muted-foreground">Something broken or not working? Let us know and we'll fix it fast.</p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleTechIssue} className="gap-2 shrink-0">
              <MessageCircle className="h-4 w-4" /> Report a Technical Issue
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Common Questions</h2>
          <Accordion type="single" collapsible className="glass-card rounded-lg px-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                <AccordionTrigger className="text-left text-sm hover:no-underline hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact Form */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Contact Us</h2>
          <form onSubmit={handleSubmit} className="glass-card rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="support-name">Name *</Label>
                <Input
                  id="support-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Email *</Label>
                <Input
                  id="support-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={255}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                name="subject"
                autoComplete="off"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message *</Label>
              <Textarea
                id="support-message"
                name="message"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help…"
                rows={5}
                maxLength={2000}
                required
              />
            </div>
            <Button type="submit" disabled={sending} className="gap-2">
              <Send className="h-4 w-4" /> {sending ? "Opening…" : "Send Message"}
            </Button>
            <p className="text-xs text-muted-foreground">This will open your email app to send the message to our support team.</p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Support;
