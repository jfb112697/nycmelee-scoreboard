import { useLocation } from "@solidjs/router";
import type { ComponentProps } from "solid-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

import { cn } from "~/lib/utils";

export function MainNav(props: ComponentProps<"nav">) {
  const location = useLocation();
  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Stream Queue",
      href: "/stream-queue",
    },
  ];

  const getNavItems = () => {
    return navItems.map((item) => {
      const isActive = location.pathname === item.href;
      return (
        <a href={item.href} class={cn("text-lg", isActive && "text-primary")}>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
          </NavigationMenuItem>
        </a>
      );
    });
  };

  return (
    <nav class="flex items-center gap-4 pl-4 text-lg text-muted-foreground">
      <NavigationMenu>{getNavItems()}</NavigationMenu>
    </nav>
  );
}
