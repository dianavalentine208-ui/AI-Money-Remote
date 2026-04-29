import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Check } from "lucide-react";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Get a taste of AI content creation.",
    features: ["5 hook generations / mo", "Browse Cinematic Vibes", "Basic Affiliate Search"],
    cta: "Get Started",
    highlight: false,
    priceId: null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For serious creators scaling up.",
    features: ["Unlimited hooks", "Persona Clone (1 twin)", "Full Cinematic Library", "Affiliate Matchmaker", "Priority support"],
    cta: "Go Pro",
    highlight: true,
    priceId: "pro_monthly",
  },
  {
    name: "30-Day Launchpad",
    price: "$97",
    period: " one-time",
    desc: "Premium coaching + full auto-build.",
    features: ["Everything in Pro", "Guided 30-day plan", "Done-for-you channel setup", "1-on-1 strategy call", "Lifetime Pro access"],
    cta: "Join Launchpad",
    highlight: false,
    priceId: "launchpad_onetime",
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (priceId: string | null) => {
    if (!priceId) {
      navigate(user ? "/dashboard" : "/auth");
      return;
    }
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/checkout?price=${priceId}`);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <header className="border-b border-border/30 glass-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">AI Money Remote</span>
          </Link>
        </div>
      </header>

      <main className="container py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Simple, Creator-First Pricing</h1>
          <p className="text-muted-foreground max-w-md mx-auto">No hidden fees. Start free, upgrade when you're ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-xl p-6 flex flex-col ${plan.highlight ? "bg-gradient-gold shadow-gold text-primary-foreground" : "glass-card"}`}>
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>}
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.desc}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "glass" : "hero"}
                className="w-full"
                onClick={() => handlePlanClick(plan.priceId)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
