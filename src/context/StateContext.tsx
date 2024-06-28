// src/context/StateContext.tsx
import {
  createContext,
  useContext,
  createSignal,
  Accessor,
  createEffect,
} from "solid-js";
import { createStore, SetStoreFunction, produce } from "solid-js/store";
import { invoke } from "@tauri-apps/api";
import { readBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

import { State, Scoreboard, Player, Character, Commentator } from "../types";
import { Pronouns } from "../enums";
import { useDb } from "./DatabaseContext";

const initialState: State = {
  scoreboard: {
    players: [
      {
        name: "Red Squirrel",
        sponsor: null,
        score: 0,
        h2hWins: 0,
        pronouns: Pronouns.HeHim,
      },
      {
        name: "Brando",
        sponsor: null,
        score: 0,
        h2hWins: 0,
        pronouns: Pronouns.HeHim,
      },
    ],
    Player1: {
      name: "Red Squirrel",
      sponsor: null,
      score: 0,
      h2hWins: 0,
      pronouns: Pronouns.HeHim,
    },
    Player2: {
      name: "Brando",
      sponsor: null,
      score: 0,
      h2hWins: 0,
      pronouns: Pronouns.HeHim,
    },
    round: "You need a round for the overlay to not crash",
    bracket: null,
    bestof: null,
    tournamentName: null,
    Commentators: [
      { name: "Commentator 1", twitter: "twitter.com" },
      { name: "Commentator 2", twitter: "twitter.com" },
    ],
    BreakRow1: null,
    BreakRow2: null,
    BreakRow3: null,
    countdown: null,
    Smashgg: {
      slug: null,
      streamQueue: null,
    },
    lowerThird: {
      LeftAnnotationText: "NEXT",
      Text1: "Starts at",
      Text2: null,
      TitleText: null,
      ClockText: null,
      Music: null,
      Compact: false,
      Commentary: true,
    },
  },
  characters: null,
  secrets: {},
  commands: [],
  settings: {
    ggToken: "",
    ggTournamentSlug: "",
    port: 80,
  },
  streamQueues: [],
  selectedStream: "",
};

const StateContext = createContext<
  | {
      state: State;
      update: UpdateFunctions;
      commitScoreboard: () => Promise<void>;
      setState: SetStoreFunction<State>;
    }
  | undefined
>(undefined);

type UpdateFunctions = {
  scoreboard: {
    players: {
      [index: number]: {
        update: (player: Partial<Player>) => void;
      };
    };
    Player1: {
      update: (player: Partial<Player>) => void;
    };
    Player2: {
      update: (player: Partial<Player>) => void;
    };
    update: (scoreboard: Partial<Scoreboard>) => void;
    Commentators: {
      [index: number]: {
        update: (commentator: Partial<Commentator>) => void;
      };
      add: (commentator: Commentator) => void;
      removeLast: () => void;
    };
    lowerThird: {
      update: (lowerThird: Partial<Scoreboard["lowerThird"]>) => void;
    };
  };
  characters: {
    update: (characters: Character[] | null) => void;
  };
};

function createUpdateFunctions(
  setState: SetStoreFunction<State>
): UpdateFunctions {
  return {
    scoreboard: {
      update: (scoreboard: Partial<Scoreboard>) =>
        setState(
          produce((s) => {
            Object.assign(s.scoreboard, scoreboard);
          })
        ),
      players: new Proxy({} as any, {
        get: (_, index) => ({
          update: (player: Partial<Player>) =>
            setState(
              produce((s) => {
                Object.assign(
                  s.scoreboard.players[parseInt(index as string)],
                  player
                );
              })
            ),
        }),
      }),

      Player1: {
        update: (player: Partial<Player>) =>
          setState(
            produce((s) => {
              Object.assign(s.scoreboard.Player1, player);
            })
          ),
      },
      Player2: {
        update: (player: Partial<Player>) =>
          setState(
            produce((s) => {
              Object.assign(s.scoreboard.Player2, player);
            })
          ),
      },
      Commentators: {
        ...new Proxy({} as any, {
          get: (_, index) => ({
            update: (commentator: Partial<Commentator>) =>
              setState(
                produce((s) => {
                  Object.assign(
                    s.scoreboard.Commentators[parseInt(index as string)],
                    commentator
                  );
                })
              ),
          }),
        }),
        add: (commentator: Commentator) =>
          setState(
            produce((s) => {
              s.scoreboard.Commentators.push(commentator);
            })
          ),
        removeLast: () =>
          setState(
            produce((s) => {
              if (s.scoreboard.Commentators.length > 0) {
                s.scoreboard.Commentators.pop();
              }
            })
          ),
      },
      lowerThird: {
        update: (lowerThird: Partial<Scoreboard["lowerThird"]>) =>
          setState(
            produce((s) => {
              Object.assign(s.scoreboard.lowerThird, lowerThird);
            })
          ),
      },
    },
    characters: {
      update: (characters: Character[] | null) =>
        setState(
          produce((s) => {
            s.characters = characters;
          })
        ),
    },
  };
}

export function StateProvider(props: { children: any }) {
  const [state, setState] = createStore<State>(initialState);
  const update = createUpdateFunctions(setState);
  const [charactersLoaded, setCharactersLoaded] = createSignal(false);
  const { saveSuggestion } = useDb();

  const commitScoreboard = async () => {
    state.scoreboard.players.forEach((player) => {
      saveSuggestion(player.name);
    });
    update.scoreboard.Player1.update(state.scoreboard.players[0]);
    update.scoreboard.Player2.update(state.scoreboard.players[1]);
    await invoke("update_response", {
      newResponse: JSON.stringify(state.scoreboard),
    });
  };

  createEffect(async () => {
    if (charactersLoaded()) return;

    const characters = state.characters;
    if (!characters) return;

    let updated = false;
    const updatedCharacters = await Promise.all(
      characters.map(async (character) => {
        if (!character.url) {
          const imagePath = `icons/${character.name}/0.png`;
          let uint8Array;
          try {
            uint8Array = await readBinaryFile(imagePath, {
              dir: BaseDirectory.AppData,
            });
          } catch {
            console.log("Failed to load image for character", character.name);
            return character;
          }
          console.log(character.path, uint8Array);
          const objectURL = URL.createObjectURL(
            new Blob([uint8Array], { type: "image/png" })
          );
          updated = true;
          return { ...character, url: objectURL };
        }
        return character;
      })
    );

    if (updated) {
      update.characters.update(updatedCharacters);
      setCharactersLoaded(true);
    }
  });

  return (
    <StateContext.Provider
      value={{ state, update, commitScoreboard, setState }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
