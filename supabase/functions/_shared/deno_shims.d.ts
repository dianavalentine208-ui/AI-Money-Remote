// Minimal shims so TS/ESLint can typecheck Supabase Edge (Deno) files.

// NOTE: `Deno` is already declared in `supabase/functions/edge-runtime-shims.d.ts`.
// Keeping the declaration in only one place avoids TS2451 (Cannot redeclare block-scoped variable 'Deno').

declare module "https://esm.sh/stripe@18.5.0" {
  const Stripe: new (...args: unknown[]) => unknown;
  export default Stripe;
}

