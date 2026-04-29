import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LaunchpadProgressBar } from "@/components/LaunchpadProgressBar";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* On desktop, sidebar is always open and non-collapsible from the user's view.
          On mobile, it stays as a slide-out sheet via SidebarProvider. */}
      <SidebarProvider defaultOpen open={isMobile ? undefined : true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile-only trigger row */}
            <div className="lg:hidden flex items-center h-12 border-b border-border/30 bg-card/40 backdrop-blur-sm px-3">
              <SidebarTrigger />
              <span className="ml-2 text-sm font-semibold">AI Money Remote</span>
            </div>
            <LaunchpadProgressBar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
