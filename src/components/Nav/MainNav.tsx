import { useLocation } from "@solidjs/router";
import { hrtime } from "process";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

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
        <a
          href={item.href}
          class={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive && "text-primary"
          )}
        >
          {item.name}
        </a>
      );
    });
  };

  return (
    <nav class="flex items-center gap-4 pl-4 text-lg text-muted-foreground">
      {getNavItems()}
    </nav>
  );
}
