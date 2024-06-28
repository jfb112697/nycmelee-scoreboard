import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { useAppState } from "~/context/StateContext";
import { Settings } from "~/types";
import {
  NumberField,
  NumberFieldInput,
  NumberFieldLabel,
} from "../ui/number-field";

export function SettingsPage() {
  const { state, setState } = useAppState();
  const [settings, setSettings] = createSignal<Settings>(state.settings);
  const [open, setOpen] = createSignal(false);

  const saveSettings = () => {
    setState({ ...state, settings: settings() });
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open()}>
      <DialogTrigger as={Button<"button">}>Settings</DialogTrigger>
      <DialogContent class="sm:max-w-[425px] md:max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Edit settings</DialogTitle>
          <DialogDescription>
            Make changes to various settings here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <TextField class="grid grid-cols-4 items-center gap-4">
            <TextFieldLabel class="text-right">
              Start GG API Token
            </TextFieldLabel>
            <TextFieldInput
              value={settings().ggToken}
              class="col-span-3"
              type="text"
              onInput={(e) => {
                setSettings({
                  ...settings(),
                  ggToken: e.currentTarget.value,
                });
              }}
            />
          </TextField>
          <TextField class="grid grid-cols-4 items-center gap-4">
            <TextFieldLabel class="text-right">
              Start GG Tournament Slug
            </TextFieldLabel>
            <TextFieldInput
              value={settings().ggTournamentSlug}
              onInput={(e) => {
                setSettings({
                  ...settings(),
                  ggTournamentSlug: e.currentTarget.value,
                });
              }}
              class="col-span-3"
              type="text"
            />
          </TextField>
          <NumberField
            class="grid grid-cols-4 items-center justify-start gap-4"
            onRawValueChange={(value) =>
              setState((prevState) => ({
                ...prevState,
                settings: { ...prevState.settings, port: value },
              }))
            }
            defaultValue={settings().port}
            value={Number.isNaN(settings().port) ? "" : settings().port}
            validationState={settings().port < 0 ? "invalid" : "valid"}
          >
            <NumberFieldLabel>Port</NumberFieldLabel>
            <NumberFieldInput />
          </NumberField>
        </div>
        <DialogFooter>
          <Button onMouseDown={saveSettings} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsPage;
