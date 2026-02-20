"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthService } from "@/services/authService";
import { ChevronsUpDown, Clapperboard, LayoutDashboard, Link2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Renderizados", url: "/rendered-videos", icon: Clapperboard },
  { title: "Integrações", url: "/integrations", icon: Link2 },
];

export function AppSidebar() {
  const authService = useAuthService();
  const pathname = usePathname();
  const router = useRouter();
  const user = authService.getSession.data?.user;

  const handleSignOut = () => {
    authService.signOut.mutate(undefined, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            Q
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Quizzio
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 hover:bg-sidebar-accent/50",
                        pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      )}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full">
                  <Avatar className="size-8">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">{user?.name ?? "Usuário"}</span>
                    <span className="text-xs text-sidebar-foreground/60">{user?.email ?? "sem-email@quizzio.app"}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center">
                <div className="px-2 py-1.5">
                  <p className="font-medium text-sm">{user?.name ?? "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email ?? "sem-email@quizzio.app"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={authService.signOut.isPending}
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
