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
      mode: "now",
      LeftAnnotationText: "NEXT",
      Text1: "Starts at",
      Text2: null,
      TitleText: null,
      ClockText: null,
      Music: null,
      Scores: false,
      Commentary: true,
      Compact: false,
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
  home: {
    currentTab: "match",
  },
  playerDbInstance: null,
  updateStreamQueue: null,
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
    console.log("Committing scoreboard");
    state.scoreboard.players.forEach((player) => {
      saveSuggestion(player.name, player.sponsor || "");
    });

    if (state.playerDbInstance) {
      const player1Name = state.scoreboard.players[0].name;
      const player2Name = state.scoreboard.players[1].name;

      try {
        const result = await state.playerDbInstance.select(
          `SELECT 
             SUM(CASE WHEN s.winner_id = p1.player_id THEN 1 ELSE 0 END) AS Player1Wins, 
             SUM(CASE WHEN s.winner_id = p2.player_id THEN 1 ELSE 0 END) AS Player2Wins 
           FROM 
             sets s,
             (SELECT player_id FROM players WHERE tag = '${player1Name}') p1,
             (SELECT player_id FROM players WHERE tag = '${player2Name}') p2 
           WHERE 
             (s.p1_id = p1.player_id AND s.p2_id = p2.player_id) 
             OR 
             (s.p1_id = p2.player_id AND s.p2_id = p1.player_id);`
        );

        console.log(player1Name, player2Name);

        console.log(result);

        if (result.length > 0) {
          const { Player1Wins, Player2Wins } = result[0];
          update.scoreboard.players[0].update({ h2hWins: Player1Wins || 0 });
          update.scoreboard.players[1].update({ h2hWins: Player2Wins || 0 });
        }
      } catch (error) {
        console.error("Error querying player database:", error);
      }
    }
    // Start backwards compatiblity changes

    update.scoreboard.Player1.update(state.scoreboard.players[0]);
    update.scoreboard.Player2.update(state.scoreboard.players[1]);
    setState({
      ...state,
      scoreboard: {
        ...state.scoreboard,
        Smashgg: {
          ...state.scoreboard.Smashgg,
          slug: state.settings.ggTournamentSlug,
        },
      },
    });
    setState({
      ...state,
      scoreboard: {
        ...state.scoreboard,
        lowerThird: {
          ...state.scoreboard.lowerThird,
          Compact: state.scoreboard.lowerThird.Scores,
        },
      },
    });
    // end backwards compatibility - start lower third updating
    if (state.scoreboard.lowerThird.mode == "now") {
      setState({
        ...state,
        scoreboard: {
          ...state.scoreboard,
          lowerThird: {
            ...state.scoreboard.lowerThird,
            LeftAnnotationText: "NOW",
            TitleText: `${state.scoreboard.players[0].name} vs ${state.scoreboard.players[1].name}`,
          },
        },
      });
    } else if (state.scoreboard.lowerThird.mode == "next") {
      if (state.selectedStream && state.streamQueues) {
        const streamQueue = state.streamQueues.find(
          (sQ) => sQ.stream.streamName === state.selectedStream
        );
        if (streamQueue) {
          let [entrant1, entrant2] = streamQueue.sets[0].slots;
          setState({
            ...state,
            scoreboard: {
              ...state.scoreboard,
              lowerThird: {
                ...state.scoreboard.lowerThird,
                LeftAnnotationText: "NEXT",
                TitleText: `${entrant1.entrant.name} vs ${entrant2.entrant.name}`,
              },
            },
          });
        }
      }
    }

    await invoke("update_response", {
      newResponse: JSON.stringify(state.scoreboard),
    });
  };

  createEffect(() => {
    if (state.updateStreamQueue != null) {
      setInterval(() => {
        console.log("fetching stream q");
        state.updateStreamQueue();
      }, 10000);
    }
  });

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
