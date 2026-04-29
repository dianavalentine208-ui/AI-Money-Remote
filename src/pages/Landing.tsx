import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Film, Target, PenTool } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BRAND_LOGO_URL = "https://i.postimg.cc/cHZ2gSvr/IMG-3292.png";

const features = [
  { icon: Shield, title: "Persona Clone", desc: "Build your AI Digital Twin from a 60-second video." },
  { icon: Film, title: "Cinematic Vibes", desc: "Stunning B-roll generated in seconds, not hours." },
  { icon: Target, title: "Affiliate Matchmaker", desc: "Find products that fit your niche automatically." },
  { icon: PenTool, title: "Auto-Hook Scripts", desc: "Viral hooks written for you, every single time." },
];

const Landing = () => {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard" : "/auth";

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img
              src={BRAND_LOGO_URL}
              alt="AI Money Remote logo"
              className="h-8 w-8 rounded-xl object-cover ring-1 ring-primary/40 shadow-[0_0_18px_-2px_hsl(var(--primary)/0.6)]"
            />
            <span className="font-bold text-lg tracking-tight">AI Money Remote</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link to={ctaLink}>
              <Button variant="hero" size="sm">{user ? "Dashboard" : "Get Started"}</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-glow-pulse" />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <img
            src={BRAND_LOGO_URL}
            alt="AI Money Remote logo"
            className="h-24 w-24 mx-auto mb-8 rounded-2xl object-cover ring-1 ring-primary/40 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.7)] animate-fade-in"
          />
          <p className="text-primary font-medium text-sm tracking-widest uppercase mb-4 animate-fade-in">The future of faceless content</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Your <span className="text-gradient-gold">Digital Twin</span> Creates Content While You Sleep
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Clone your voice, generate cinematic visuals, and automate your content pipeline — no face required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to={ctaLink}>
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Start Your 30-Day Launchpad
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="glass" size="lg" className="text-base px-8 py-6">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Four Tools. One Remote.</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Everything you need to go from zero to a fully automated content machine.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="glass-card rounded-lg p-6 hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: `${0.1 * i}s` }}>
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="container max-w-lg mx-auto glass-card rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-3">Ready to build your Digital Twin?</h2>
          <p className="text-muted-foreground mb-6">Join the 30-Day Launchpad and go live in one month.</p>
          <Link to={ctaLink}>
            <Button variant="hero" size="lg" className="text-base px-8">Get Started Free</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/30 py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 AI Money Remote</span>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
