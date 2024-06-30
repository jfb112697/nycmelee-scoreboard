import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
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
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";

export function CommandSearchBar() {
  const [open, setOpen] = createSignal(false);
  const { state, update } = useAppState();

  const registerShortcut = async () => {
    try {
      await register("CommandOrControl+Space", () => {
        setOpen((prevOpen) => !prevOpen);
        appWindow.setFocus();
      });
      console.log("Global shortcut registered successfully");
    } catch (error) {
      console.error("Failed to register global shortcut:", error);
    }
  };

  onMount(() => {
    registerShortcut();
  });

  onCleanup(async () => {
    try {
      await unregister("CommandOrControl+Space");
      console.log("Global shortcut unregistered successfully");
    } catch (error) {
      console.error("Failed to unregister global shortcut:", error);
    }
  });

  return (
    <>
      <Button
        variant="outline"
        class="text-muted-foreground flex items-center gap-3"
        onClick={() => setOpen(true)}
      >
        Search...
        <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span class="text-xs">⌘</span>Space
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
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandSearchBar;
