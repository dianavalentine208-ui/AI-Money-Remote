import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (authLoading) return;
    if (user || session) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, user, session, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error, data } = await signUp(email, password);
        if (error) throw error;

        const hasActiveSession = !!data?.session;
        const isConfirmed = !!data?.user?.email_confirmed_at;
        if (hasActiveSession || isConfirmed) {
          toast.success("Account ready. Redirecting...");
          navigate(redirect, { replace: true });
        } else {
          toast.success("Check your email to verify your account!");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/30 glass-card">
        <div className="container flex items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">AI Money Remote</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">
            {mode === "forgot" ? "Reset your password" : mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {mode === "forgot"
              ? "We'll send you a reset link."
              : mode === "signup"
              ? "Start your content empire today."
              : "Sign in to continue building."}
          </p>

          {import.meta.env.DEV && (
            <Alert className="mb-6 text-left">
              <AlertTitle className="text-sm">Email confirmation (dev)</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground space-y-1">
                <span className="block">
                  Supabase enforces this server-side (GoTrue), not in this repo. For a test account: Dashboard →
                  Authentication → Providers → Email → turn off &quot;Confirm email&quot;, or run{" "}
                  <code className="rounded bg-muted px-1 py-0.5">supabase/scripts/confirm-user-email.sql</code>{" "}
                  in the SQL Editor. Purely local <code className="rounded bg-muted px-1 py-0.5">supabase start</code>{" "}
                  can set <code className="rounded bg-muted px-1 py-0.5">[auth.email] enable_confirmations = false</code>{" "}
                  in <code className="rounded bg-muted px-1 py-0.5">config.toml</code> (do not push that to production
                  unless you mean to).
                </span>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                name="email"
                type="email"
                autoComplete={
                  mode === "signup" ? "email" : mode === "forgot" ? "email" : "username"
                }
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card border-border"
              />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  name="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-card border-border"
                />
              </div>
            )}
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading
                ? "Loading…"
                : mode === "forgot"
                ? "Send Reset Link"
                : mode === "signup"
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <div className="mt-4">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: window.location.origin,
                      },
                    });
                    if (result.error) {
                      toast.error(result.error.message || "Google sign-in failed");
                      return;
                    }
                  } catch (err: any) {
                    toast.error(err.message || "Google sign-in failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await supabase.auth.signInWithOAuth({
                      provider: "apple",
                      options: {
                        redirectTo: window.location.origin,
                      },
                    });
                    if (result.error) {
                      toast.error(result.error.message || "Apple sign-in failed");
                      return;
                    }
                  } catch (err: any) {
                    toast.error(err.message || "Apple sign-in failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </Button>
            </div>
          )}

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="block w-full text-center text-xs text-muted-foreground hover:text-primary mt-3"
            >
              Forgot your password?
            </button>
          )}

          <div className="text-center text-sm text-muted-foreground mt-6">
            {mode === "forgot" ? (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-primary hover:underline font-medium"
              >
                Back to Sign In
              </button>
            ) : mode === "signup" ? (
              <span className="inline-block">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span className="inline-block">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
