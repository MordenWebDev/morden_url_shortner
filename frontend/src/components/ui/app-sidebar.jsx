
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavUser } from "@/components/ui/NavUser";

// Sidebar navigation data
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "/",
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Generate url",
          url: "/generateurl",
        },
        {
          title: "My urls",
          url: "/myurls",
        },
      ],
    },
  ],
};

export function AppSidebar(props) {
  
  const location = useLocation(); // Get the current route

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Urlshorty</span> 
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Create a SidebarGroup for each parent. */}
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url} // Set active based on the current URL
                    >
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
      {localStorage.getItem('email')?
        <NavUser
          user={{
            name: "",
            email: localStorage.getItem('email'),
          
          }}
        />:null}
      </SidebarFooter>
    </Sidebar>
  );
}
