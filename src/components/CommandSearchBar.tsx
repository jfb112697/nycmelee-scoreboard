import { For, createEffect, createSignal, onCleanup } from "solid-js";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { TextField, TextFieldInput } from "./ui/text-field";
import { Button } from "./ui/button";
import { useAppState } from "~/context/StateContext";

export function CommandSearchBar() {
  const [open, setOpen] = createSignal(false);
  const { state, update } = useAppState();

  createEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    onCleanup(() => document.removeEventListener("keydown", down));
  });

  return (
    <>
      <Button
        variant={"outline"}
        class="text-muted-foreground flex items-center gap-3"
        onMouseDown={setOpen}
      >
        Search...
        <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span class="text-xs">⌘</span>J
        </kbd>
      </Button>

      <CommandDialog open={open()} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <For each={state.commands}>
              {(command) => (
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    command.action();
                  }}
                  class="flex items-center justify-between"
                >
                  <h3>{command.name}</h3>
                  <p>{command.description}</p>
                </CommandItem>
              )}
            </For>
            <CommandItem>
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandSearchBar;
