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
import {
  Calendar,
  HeartPlus,
  HomeIcon,
  Rss,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import AdminLogout from "./AdminLogout";

const items = [
  {
    title: "Home",
    url: "/admin",
    icon: HomeIcon,
  },
  {
    title: "Services",
    url: "/admin/services",
    icon: HeartPlus,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: Rss,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader>
        {/* <Image src={"/next.svg"} width={120} height={200} alt="Logo" /> */}
        <p className="text-lg font-bold">GSC</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
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
        <AdminLogout/>
      </SidebarFooter>
    </Sidebar>
  );
}
