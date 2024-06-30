import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
} from "solid-js";
import { Pronouns } from "~/enums";
import { Character, Player } from "~/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxItemIndicator,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  Combobox,
} from "./ui/combobox";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "./ui/dropdown-menu";
import { TextField, TextFieldInput } from "./ui/text-field";
import { useAppState } from "~/context/StateContext";
import { useDb } from "~/context/DatabaseContext";
import { Button } from "./ui/button";
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
} from "./ui/number-field";

const PlayerContainer = (props: { index: number; ref: any }) => {
  const { state, update, commitScoreboard } = useAppState();
  const { getSuggestions, saveSuggestion } = useDb();
  let localRef: HTMLElement;
  const [local, others] = splitProps(props, ["ref"]);

  createEffect(() => {
    if (local.ref) {
      local.ref(localRef);
    }
  });

  const player = createMemo(() => state.scoreboard.players[props.index]);
  const updatePlayer = (data: Partial<typeof player>) => {
    update.scoreboard.players[props.index].update(data);
  };

  const [nameSuggestions, setNameSuggestions] = createSignal<
    { name: string; sponsor: string }[]
  >([]);
  const [inputValue, setInputValue] = createSignal(player().name || "");

  createEffect(async () => {
    if (player().name) {
      const suggestions = await getSuggestions(player().name || "");
      setInputValue(player().name);
      setNameSuggestions(suggestions);
    } else {
      setNameSuggestions(await getSuggestions(""));
    }
  });

  createEffect(() => {
    if (player().realCharacter) {
      updatePlayer({ ...player(), character: player().realCharacter!.name });
    }
  });

  const characters = createMemo(() => state.characters || []);

  return (
    <Card
      ref={(el) => (localRef = el)}
      class="flex flex-col justify-between w-full"
      id={(props.index == 0 && "player1") || ""}
    >
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Player {props.index + 1}
        </CardTitle>
        <Show
          when={player().realCharacter && player()!.realCharacter?.url}
          fallback={<div class="h-8 w-8" />}
        >
          <img
            src={player().realCharacter!.url}
            alt={player().realCharacter!.name}
            class="h-8 w-8 object-cover rounded-[3px]"
          />
        </Show>
      </CardHeader>
      <CardContent tabIndex={props.index + 1}>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between gap-3 items-end w-full">
            <TextField class="max-w-[85px]">
              <TextFieldInput
                type="text"
                id="sponsor"
                placeholder="Sponsor"
                value={player().sponsor || ""}
                onInput={(e) =>
                  updatePlayer({ sponsor: e.currentTarget.value })
                }
              />
            </TextField>
            <Combobox<Partial<Player>>
              options={nameSuggestions()}
              optionValue={(item) => item.name || ""} // Update the optionValue prop to return the name property of the item
              optionTextValue={(item) => item.name || ""}
              optionLabel={(item) => item.name || ""}
              placeholder="Name"
              value={player()}
              onBlur={() => {
                console.log(player());
                saveSuggestion(player().name, player().sponsor || "");
              }}
              class="w-full"
              onChange={(value) => {
                updatePlayer({
                  name: value.name,
                  sponsor: value.sponsor || player().sponsor,
                });
                setInputValue(value.name || "");
              }}
              itemComponent={(props) => (
                <ComboboxItem item={props.item}>
                  <ComboboxItemLabel>
                    {props.item.rawValue.name}
                  </ComboboxItemLabel>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              )}
            >
              <ComboboxControl aria-label="Names">
                <ComboboxInput
                  tabIndex={1}
                  value={inputValue()}
                  class="name-input"
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    setInputValue(value);
                    const matchingPlayer = nameSuggestions().find(
                      (player) =>
                        player.name.toLowerCase() === value.toLowerCase()
                    );
                    if (matchingPlayer) {
                      updatePlayer({
                        name: matchingPlayer.name,
                        sponsor: matchingPlayer.sponsor,
                      });
                    } else {
                      updatePlayer({ name: value, sponsor: "" });
                    }
                  }}
                />
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent />
            </Combobox>
            <Combobox<Character>
              options={characters()}
              disallowEmptySelection={true}
              selectionBehavior="toggle"
              optionTextValue={(item) => item.name}
              optionValue={(item) => item.name}
              optionLabel="name"
              value={player().realCharacter || undefined}
              onChange={(v) => updatePlayer({ realCharacter: v })}
              placeholder="Character"
              itemComponent={(props) => (
                <ComboboxItem item={props.item} class="flex items-center gap-2">
                  <ComboboxItemLabel>
                    {props.item.rawValue.name}
                  </ComboboxItemLabel>
                  <ComboboxItemIndicator />
                  <img
                    src={props.item.rawValue.url}
                    alt={props.item.rawValue.name}
                    class="h-8 w-8 object-cover rounded-[3px]"
                  />
                </ComboboxItem>
              )}
            >
              <ComboboxControl aria-label="Character">
                <ComboboxInput tabIndex={1} />
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent />
            </Combobox>
          </div>
          <div class="flex gap-3">
            <NumberField
              class="min-w-[45px] flex flex-col gap-2"
              onRawValueChange={(value) => updatePlayer({ score: value })}
              defaultValue={player().score}
              value={Number.isNaN(player().score) ? "" : player().score}
              validationState={player().score < 0 ? "invalid" : "valid"}
            >
              <div class="flex min-w-[45px] relative ">
                <NumberFieldInput tabIndex={1} />
                <NumberFieldIncrementTrigger />
                <NumberFieldDecrementTrigger />
              </div>
            </NumberField>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button tabIndex={1} variant={"outline"}>
                  {player().pronouns}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <For each={Object.values(Pronouns)}>
                  {(pronoun) => (
                    <DropdownMenuItem
                      onClick={() => updatePlayer({ pronouns: pronoun })}
                    >
                      {pronoun}
                    </DropdownMenuItem>
                  )}
                </For>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={"destructive"}
              onClick={() => {
                updatePlayer({
                  sponsor: "",
                  name: "",
                  score: 0,
                  pronouns: Pronouns.TheyThem,
                });
                setInputValue("");
              }}
            >
              Reset
            </Button>
            <Button
              class="w-full"
              onClick={() => {
                updatePlayer({ score: player().score + 1 });
                commitScoreboard();
              }}
            >
              Select Winner
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerContainer;
