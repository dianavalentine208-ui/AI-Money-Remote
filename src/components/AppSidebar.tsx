import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Rocket, LayoutDashboard, User, Film, Target, Calendar, UserCircle, Settings, LogOut, Crown } from "lucide-react";

const BRAND_LOGO_URL = "https://i.postimg.cc/cHZ2gSvr/IMG-3292.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Persona Clone", url: "/persona-clone", icon: User },
  { title: "Cinematic Vibes", url: "/cinematic-vibes", icon: Film },
  { title: "Affiliate Matchmaker", url: "/affiliate-matchmaker", icon: Target },
  { title: "30-Day Launchpad", url: "/launchpad", icon: Calendar },
  { title: "My Profile", url: "/profile", icon: UserCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { tier, hasLaunchpadAccess } = useSubscription();

  const { data: completedDays } = useQuery({
    queryKey: ["launchpad_progress", user?.id],
    queryFn: async () => {
      if (!user) return [] as number[];
      const { data } = await supabase.from("launchpad_progress").select("day").eq("user_id", user.id);
      return (data?.map((r: any) => r.day) || []) as number[];
    },
    enabled: !!user,
  });

  const nextDay = useMemo(() => {
    const completed = new Set(completedDays || []);
    for (let d = 1; d <= 30; d++) if (!completed.has(d)) return d;
    return 30;
  }, [completedDays]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="offcanvas" className="dark border-r border-sidebar-border">
      <SidebarHeader className="p-3">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1 mb-2">
          <img
            src={BRAND_LOGO_URL}
            alt="AI Money Remote logo"
            className="h-8 w-8 rounded-xl object-cover shrink-0 ring-1 ring-primary/40 shadow-[0_0_20px_-2px_hsl(var(--primary)/0.6)]"
          />
          {!collapsed && <span className="font-bold tracking-tight text-sidebar-foreground">AI Money Remote</span>}
        </Link>

        {/* Hero day button */}
        <Link to="/launchpad" className="block">
          {collapsed ? (
            <Button variant="hero" size="icon" className="w-full" title={`Start Day ${nextDay} Roadmap`}>
              <Rocket className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="hero" className="w-full justify-start gap-2 font-semibold">
              <Rocket className="h-4 w-4" />
              <span className="truncate">Start Day {nextDay} Roadmap</span>
            </Button>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border space-y-2">
        {tier !== "free" && !collapsed && (
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary">
            <Crown className="h-3 w-3" />
            {hasLaunchpadAccess ? "Launchpad" : tier}
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" isActive={isActive("/settings")}>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign Out" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
