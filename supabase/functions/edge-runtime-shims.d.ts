// TypeScript shim for Supabase Edge Functions when the editor is not using Deno's language server.
// This keeps local TS diagnostics happy; runtime remains Deno.

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

declare module "std/http/server.ts" {
  export interface ServeOptions {
    port?: number;
    hostname?: string;
    onListen?: (params: { hostname: string; port: number }) => void;
    signal?: AbortSignal;
  }
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: ServeOptions,
  ): void;
}

