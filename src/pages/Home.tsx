import {
  createSignal,
  createEffect,
  onCleanup,
  For,
  Show,
  onMount,
} from "solid-js";
import { listen, once } from "@tauri-apps/api/event";
import { useAppState } from "../context/StateContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { appDataDir } from "@tauri-apps/api/path";
import PlayerContainer from "~/components/PlayerContainer";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { Button } from "~/components/ui/button";
import ScoreboardInfoContainer from "~/components/ScoreboardInfoContainer";
import LowerThird from "~/components/LowerThird";
import { ScoreboardCommand } from "~/types";
import { useNavigate } from "@solidjs/router";
import { fs, path } from "@tauri-apps/api";
import { P } from "node_modules/@kobalte/core/dist/index-b0947c3c";
import { InitializeDatabase } from "~/components/Settings/MeleePlayerDatabase";

const createCommands = (
  setCurrentTab: (tab: string) => void,
  focusPlayer1: () => void,
  navigate: (path: string) => void,
  commitScoreboard: () => void
): ScoreboardCommand[] => [
  {
    name: "Players",
    description: "Go to the players section",
    action: () => {
      navigate("/");
      setCurrentTab("match");
      focusPlayer1();
    },
  },
  {
    name: "Commentary",
    description: "Go to the commentators section",
    action: () => {
      navigate("/");
      setCurrentTab("commentary");
    },
  },
  {
    name: "Lower Third",
    description: "Go to the lower third section",
    action: () => {
      navigate("/");
      setCurrentTab("lower-third");
    },
  },
  {
    name: "Stream Queue",
    description: "Go to the stream queue section",
    action: () => {
      navigate("/stream-queue");
    },
  },
  {
    name: "Send Update",
    description: "Send the current scoreboard to the overlay",
    action: () => {
      commitScoreboard();
    },
  },
];

const Home = () => {
  const { state, update, commitScoreboard, setState } = useAppState();
  const [player1Ref, setPlayer1Ref] = createSignal<
    HTMLInputElement | undefined
  >();
  const navigate = useNavigate();

  const focusPlayer1 = () => {
    player1Ref()?.focus();
  };

  const setCurrentTab = (tab: string) => {
    setState((prev) => ({
      ...prev,
      home: { ...prev.home, currentTab: tab },
    }));
  };

  const checkForIcons = async () => {
    const appDataPath = await appDataDir();
    const iconsPath = `${appDataPath}/icons`;

    const iconsDirExists = await fs.exists(iconsPath);
    if (!iconsDirExists) {
      await fs.createDir(iconsPath, { recursive: true });
    } else {
      const iconsDirContents = await fs.readDir(iconsPath);
      if (iconsDirContents.length > 1) {
        const characters = iconsDirContents.map((file) => ({
          path: `${iconsPath}/${file.name}`,
          name: file.name as string,
        }));
        update.characters.update(characters);
      }
    }
  };

  onMount(async () => {
    const commands = createCommands(
      setCurrentTab,
      focusPlayer1,
      navigate,
      commitScoreboard
    );
    setState((prev) => ({ ...prev, commands }));
    checkForIcons();
    await InitializeDatabase();
  });

  let unlisten: any = once("tauri://file-drop", async (event) => {
    await handleDrop(event.payload as string[]);
  });

  const handleDrop = async (payload: string[]) => {
    const folderPath = payload[0];
    if (folderPath) {
      const appDataPath = await path.appDataDir();
      const iconsPath = `${appDataPath}/icons`;

      const copyFilesRecursively = async (
        sourcePath: string,
        destinationPath: string
      ) => {
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

  return (
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <div class="flex flex-col flex-1 items-stretch space-x-2 gap-2">
          <h2 class="text-3xl font-bold tracking-tight">Scoreboard</h2>
          <Show when={(state.characters || []).length < 1}>
            <div class="w-full h-48 border-dashed border-4 border-x-nycmelee-border-light flex items-center justify-center text-nycmelee-white">
              Drop character icons folder here
            </div>
          </Show>
          <Show when={(state.characters || []).length > 0}>
            <Tabs
              defaultValue="match"
              onChange={(v) => setCurrentTab(v)}
              value={state.home.currentTab || "match"}
              class="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="match">Match</TabsTrigger>
                <TabsTrigger value="commentary">Commentary</TabsTrigger>
                <TabsTrigger value="lower-third">Lower Third</TabsTrigger>
              </TabsList>
              <TabsContent value="match" class="space-y-4">
                <div class="flex justify-between gap-3 flex-wrap md:flex-nowrap">
                  <For each={state.scoreboard.players}>
                    {(player, index) => (
                      <PlayerContainer
                        index={index()}
                        ref={index() === 0 ? setPlayer1Ref : undefined}
                      />
                    )}
                  </For>
                </div>
                <ScoreboardInfoContainer />
              </TabsContent>
              <TabsContent value="commentary" class="space-y-4">
                <div class="flex flex-col justify-between gap-3">
                  <div class="flex flex-row gap-5 justify-between w-full items-center">
                    <Button
                      onClick={() =>
                        update.scoreboard.Commentators.add({
                          name: "",
                          twitter: "",
                        })
                      }
                      class="flex-shrink-0"
                    >
                      Add Commentator
                    </Button>
                    <Button onClick={commitScoreboard} class="w-full">
                      Send Update
                    </Button>
                    <Button
                      class="flex-shrink-0"
                      disabled={state.scoreboard.Commentators.length < 3}
                      onClick={() =>
                        update.scoreboard.Commentators.removeLast()
                      }
                    >
                      Remove Last Commentator
                    </Button>
                  </div>
                  <For each={state.scoreboard.Commentators}>
                    {(commentator, index) => (
                      <Card class="flex flex-col justify-between w-full">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle class="text-sm font-medium">
                            Commentator {index() + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="flex flex-row gap-3 items-end">
                            <TextField>
                              <TextFieldLabel>Name</TextFieldLabel>
                              <TextFieldInput
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={commentator.name || ""}
                                onInput={(e) =>
                                  update.scoreboard.Commentators[
                                    index()
                                  ].update({ name: e.currentTarget.value })
                                }
                              />
                            </TextField>
                            <TextField>
                              <TextFieldLabel>Twitter</TextFieldLabel>
                              <TextFieldInput
                                type="text"
                                id="twitter"
                                placeholder="Twitter"
                                value={commentator.twitter || ""}
                                onInput={(e) =>
                                  update.scoreboard.Commentators[
                                    index()
                                  ].update({ twitter: e.currentTarget.value })
                                }
                              />
                            </TextField>
                            <Button
                              variant={"destructive"}
                              class="ms-auto"
                              onClick={() => {
                                let commentators = [
                                  ...state.scoreboard.Commentators,
                                ];
                                commentators.splice(index(), 1);
                                setState({
                                  ...state,
                                  scoreboard: {
                                    ...state.scoreboard,
                                    Commentators: commentators,
                                  },
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </For>
                </div>
              </TabsContent>
              <TabsContent value="lower-third" class="space-y-4">
                <LowerThird />
              </TabsContent>
            </Tabs>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Home;
