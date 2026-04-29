// TypeScript (Node) doesn't understand remote URL imports like Deno does.
// This shim exists purely to keep editor/typecheck diagnostics quiet for
// Supabase Edge Functions that run on Deno.

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  // Keep this self-contained so TS doesn't try to resolve `std/http/server.ts`
  // in a Node environment (which causes ts(2307)).
  export type ServeOptions = {
    hostname?: string;
    port?: number;
    signal?: AbortSignal;
    onListen?: (params: { hostname: string; port: number }) => void;
  };

  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: ServeOptions,
  ): Promise<void>;
}

declare module "npm:@supabase/supabase-js@2/cors" {
  // Re-export from the package declaration to avoid value redeclarations.
  export * from "@supabase/supabase-js/cors";
}

// Supabase Edge Functions may import supabase-js via Deno's `npm:` specifier
// or via a remote ESM CDN URL. Node's TypeScript server can't resolve either,
// so we provide a minimal shim to silence editor diagnostics.
declare module "npm:@supabase/supabase-js@2" {
  // Re-export the Node package types for `npm:` imports in edge functions.
  export * from "@supabase/supabase-js";
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export const createClient: (...args: unknown[]) => unknown;
}

