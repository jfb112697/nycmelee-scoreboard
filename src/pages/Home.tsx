import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxTrigger
} from "../components/ui/combobox";
import { fs, path } from "@tauri-apps/api";
import { createSignal, createEffect, onCleanup, For, Show } from "solid-js";
import { listen } from '@tauri-apps/api/event';
import { useAppState } from "../context/StateContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card"
import { Col, Grid } from "~/components/ui/grid"
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { readBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import { Character } from "~/types";
import { Pronouns } from "../enums";
import { appDataDir } from "@tauri-apps/api/path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button";
import { useDb } from "~/context/DatabaseContext";

const Home = () => {
  const { state, updateState, setState } = useAppState();
  const [nameOptions, setNameOptions] = createSignal(["Jeremy"]);
  const { getSuggestions, saveSuggestion } = useDb();
  const [nameValue, setNameValue] = createSignal("Jeremy");
  const [isBlured, setIsBlured] = createSignal(false);

  createEffect(() => {
    if (isBlured()) {
      saveSuggestion(nameValue());
      setIsBlured(false);
    }
  })


  createEffect(async () => {
    let suggestions = await getSuggestions(nameValue() || "");
    state().scoreboard.players.map((p) => suggestions.push(p.name));
    setNameOptions(suggestions);
  })
  const checkForIcons = async () => {
    const appDataPath = await appDataDir();
    const iconsPath = `${appDataPath}/icons`;

    const iconsDirExists = await fs.exists(iconsPath);
    if (!iconsDirExists) {
      await fs.createDir(iconsPath, { recursive: true });
    } else {
      const iconsDirContents = await fs.readDir(iconsPath);
      if (iconsDirContents.length > 1) {
        const characters = iconsDirContents.map(file => ({
          path: `${iconsPath}/${file.name}`,
          name: file.name as string
        }));
        setState(prevState => ({ ...prevState, characters }));
      }
    }
  };

  createEffect(() => {
    checkForIcons();
    return onCleanup(() => {
      // cleanup code here if needed
    });
  });

  const handleDrop = async (payload: string[]) => {
    const folderPath = payload[0];
    if (folderPath) {
      const appDataPath = await path.appDataDir();
      const iconsPath = `${appDataPath}/icons`;

      const copyFilesRecursively = async (sourcePath: string, destinationPath: string) => {
        const files = await fs.readDir(sourcePath);
        for (const file of files) {
          const sourceFilePath = `${sourcePath}/${file.name}`;
          const destinationFilePath = `${destinationPath}/${file.name}`;

          try {
            await fs.readDir(sourceFilePath);
            await fs.createDir(destinationFilePath, { recursive: true });
            await copyFilesRecursively(sourceFilePath, destinationFilePath);
          } catch (e) {
            await fs.copyFile(sourceFilePath, destinationFilePath);
          }
        }
      };

      await copyFilesRecursively(folderPath, iconsPath);
      await checkForIcons();
    }
  };

  listen('tauri://file-drop', async event => {
    await handleDrop(event.payload as string[]);
  });

  const handleInputChange = (index: number, field: string, value: any) => {
    let players = [...state().scoreboard.players]; // Clone the array to ensure reactivity
    players[index] = { ...players[index], [field]: value }; // Clone the object to ensure reactivity
    updateState({ players: players });
    console.log(state());
  };

  return (
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <div class="flex flex-col flex-1 items-stretch space-x-2 gap-2">
          <h2 class="text-3xl font-bold tracking-tight">Scoreboard</h2>
          <Show when={(state().characters || []).length < 1}>
            <div class="w-full h-48 border-dashed border-4 border-x-nycmelee-border-light flex items-center justify-center text-nycmelee-white">
              Drop character icons folder here
            </div>
          </Show>
          <Show when={(state().characters || []).length > 0}>
            <Tabs defaultValue="match" class="space-y-4">
              <TabsList>
                <TabsTrigger value="match">Match</TabsTrigger>
                <TabsTrigger value="commentary" disabled>
                  Commentary
                </TabsTrigger>
                <TabsTrigger value="lower-third" disabled>
                  Lower Third
                </TabsTrigger>
              </TabsList>
              <TabsContent value="match" class="space-y-4">
                <div class="flex justify-between gap-3">
                  <For each={state().scoreboard.players}>
                    {(player, index) => (
                      <Card class="flex flex-col justify-between w-full">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle class="text-sm font-medium">Player {index() + 1}</CardTitle>
                          <Show when={player.character && player.character.url} fallback={<div class="h-8 w-8"></div>}>
                            <img src={player.character!.url} alt={player.character!.name} class="h-8 w-8 object-cover rounded-[3px]" />
                          </Show>
                        </CardHeader>
                        <CardContent>
                          <div class="flex flex-col gap-3">
                            <div class="flex justify-between gap-3 items-end w-full">
                              <TextField class=" max-w-[85px]">
                                <TextFieldInput
                                  type="text"
                                  id="sponsor"
                                  placeholder={"Sponsor"}
                                  value={player.sponsor!}
                                  onInput={(e: any) => (handleInputChange(index(), "sponsor", e.target.value))}
                                />
                              </TextField>
                              <Combobox<string>
                                options={nameOptions()}
                                optionValue={(item) => (item)}
                                optionTextValue={(item) => (item)}
                                optionLabel={(item) => (item)}
                                onBlur={(e) => { console.log(e); }}
                                placeholder="Name"
                                defaultValue={player.name}
                                value={nameValue()}
                                class="w-full"
                                onChange={(value) => { setNameValue(value); handleInputChange(index(), "name", value) }}
                                itemComponent={(props) => (
                                  <ComboboxItem item={props.item}>
                                    <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
                                    <ComboboxItemIndicator />
                                  </ComboboxItem>
                                )}
                              >
                                <ComboboxControl aria-label="Names">
                                  <ComboboxInput
                                    onInput={(e: any) => { setNameValue(e.target.value) }}
                                  />
                                  <ComboboxTrigger />
                                </ComboboxControl>
                                <ComboboxContent />
                              </Combobox>
                              <Combobox<Character>
                                options={state().characters || []}
                                disallowEmptySelection={true}
                                selectionBehavior="toggle"
                                optionTextValue={(item) => (item.name)}
                                optionValue={(item) => (item.name)}
                                optionLabel={"name"}
                                value={player.character}
                                onChange={(v) => { console.log("hi"); handleInputChange(index(), "character", v) }}
                                placeholder="Character"
                                itemComponent={(props) => (
                                  <ComboboxItem item={props.item} class="flex items-center gap-2">
                                    <ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
                                    <ComboboxItemIndicator />
                                    <img src={props.item.rawValue.url} alt={props.item.rawValue.name} class="h-8 w-8 object-cover rounded-[3px]" />
                                  </ComboboxItem>
                                )}
                              >
                                <ComboboxControl aria-label="Character">
                                  <ComboboxInput />
                                  <ComboboxTrigger />
                                </ComboboxControl>
                                <ComboboxContent />
                              </Combobox>
                            </div>
                            <div class="flex">
                              <DropdownMenu
                              >
                                <DropdownMenuTrigger>
                                  <Button>{player.pronouns}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <For each={Object.values(Pronouns)}>
                                    {(pronoun) => (
                                      <DropdownMenuItem
                                        onClick={() => handleInputChange(index(), "pronouns", pronoun)}
                                      >{pronoun}</DropdownMenuItem>
                                    )}
                                  </For>
                                </DropdownMenuContent>
                              </DropdownMenu>

                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </For>
                </div>
                <Card>

                </Card>
              </TabsContent>
            </Tabs>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Home;
