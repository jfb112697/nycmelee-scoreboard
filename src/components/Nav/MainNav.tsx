import type { ComponentProps } from "solid-js"
import { splitProps } from "solid-js"

import { cn } from "~/lib/utils"

export function MainNav(props: ComponentProps<"nav">) {
    const [, rest] = splitProps(props, ["class"])
    return (
        <nav class={cn("flex items-center space-x-4 lg:space-x-6", props.class)} {...rest}>
            <a
                href="/"
                class="text-sm font-medium transition-colors hover:text-primary"
            >
                Home
            </a>
            <a
                href="/queue"
                class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Stream Queue
            </a>
            <a
                href="/players"
                class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Players
            </a>
        </nav>
    )
}