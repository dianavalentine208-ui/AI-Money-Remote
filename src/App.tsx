import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PersonaClone from "./pages/PersonaClone";
import CinematicVibes from "./pages/CinematicVibes";
import AffiliateMatchmaker from "./pages/AffiliateMatchmaker";
import AutoHooks from "./pages/AutoHooks";
import Pricing from "./pages/Pricing";
import Launchpad from "./pages/Launchpad";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import CheckoutReturn from "./pages/CheckoutReturn";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const shell = (page: JSX.Element) => <AppShell>{page}</AppShell>;

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/return" element={<CheckoutReturn />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* App-shell wrapped routes */}
            <Route path="/dashboard" element={<ProtectedRoute>{shell(<Dashboard />)}</ProtectedRoute>} />
            <Route path="/persona-clone" element={<ProtectedRoute>{shell(<PersonaClone />)}</ProtectedRoute>} />
            <Route path="/cinematic-vibes" element={<ProtectedRoute>{shell(<CinematicVibes />)}</ProtectedRoute>} />
            <Route path="/affiliate-matchmaker" element={<ProtectedRoute>{shell(<AffiliateMatchmaker />)}</ProtectedRoute>} />
            <Route path="/auto-hooks" element={<ProtectedRoute>{shell(<AutoHooks />)}</ProtectedRoute>} />
            <Route path="/launchpad" element={<ProtectedRoute>{shell(<Launchpad />)}</ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute>{shell(<Settings />)}</ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute>{shell(<Profile />)}</ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute>{shell(<Support />)}</ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
