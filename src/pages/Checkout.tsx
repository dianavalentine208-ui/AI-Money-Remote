import { useSearchParams, Link, Navigate } from "react-router-dom";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { Zap } from "lucide-react";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get("price") || "pro_monthly";
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=/checkout?price=${priceId}`} replace />;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <header className="border-b border-border/30 glass-card">
        <div className="container flex items-center h-16">
          <Link to="/pricing" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">Checkout</span>
          </Link>
        </div>
      </header>
      <main className="container py-10 px-4 max-w-2xl mx-auto">
        <StripeEmbeddedCheckout
          priceId={priceId}
          customerEmail={user.email}
          userId={user.id}
          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
        />
      </main>
    </div>
  );
}
