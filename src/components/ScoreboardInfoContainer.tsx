import { Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TextField, TextFieldInput } from "./ui/text-field";
import { Button } from "./ui/button";
import { useAppState } from "~/context/StateContext";
import { Pronouns } from "~/enums";

const ScoreboardInfoContainer: Component<{}> = (props) => {
  const { state, update, commitScoreboard } = useAppState();

  const handleReset = () => {
    update.scoreboard.update({
      round: "",
      bestof: "",
      tournamentName: "",
      players: [
        {
          name: "",
          sponsor: "",
          score: 0,
          h2hWins: 0,
          pronouns: Pronouns.TheyThem,
        },
        {
          name: "",
          sponsor: "",
          score: 0,
          h2hWins: 0,
          pronouns: Pronouns.TheyThem,
        },
      ],
      Player1: {
        name: "",
        sponsor: "",
        score: 0,
        h2hWins: 0,
        pronouns: Pronouns.TheyThem,
      },
      Player2: {
        name: "",
        sponsor: "",
        score: 0,
        h2hWins: 0,
        pronouns: Pronouns.TheyThem,
      },
    });
  };

  const swapPlayers = () => {
    const [player1, player2] = JSON.parse(
      JSON.stringify(state.scoreboard.players),
    );
    update.scoreboard.players[0].update(player2);
    update.scoreboard.players[1].update(player1);
    console.log(player1, player2, state.scoreboard.players);
  };

  return (
    <Card class="flex flex-col w-full">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Tournament Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-3 flex-wrap md:flex-nowrap ">
          <TextField>
            <TextFieldInput
              class="w-fit"
              type="text"
              id="round"
              placeholder="Round"
              tabIndex={1}
              value={state.scoreboard.round || ""}
              onInput={(e) =>
                update.scoreboard.update({ round: e.currentTarget.value })
              }
            />
          </TextField>
          <TextField class="max-w-[80px]">
            <TextFieldInput
              type="text"
              id="bestof"
              placeholder="Best of"
              value={state.scoreboard.bestof || ""}
              onInput={(e) =>
                update.scoreboard.update({ bestof: e.currentTarget.value })
              }
            />
          </TextField>
          <TextField class="flex-shrink">
            <TextFieldInput
              type="text"
              id="tournamentName"
              placeholder="Tournament Name"
              value={state.scoreboard.tournamentName || ""}
              onInput={(e) =>
                update.scoreboard.update({
                  tournamentName: e.currentTarget.value,
                })
              }
            />
          </TextField>
          <Button
            variant={"secondary"}
            class="min-w-[105px] flex-1"
            onClick={swapPlayers}
            tabIndex={1}
          >
            Swap Ports
          </Button>
          <Button
            variant="destructive"
            tabIndex={1}
            onClick={() => {
              handleReset();
            }}
          >
            Reset
          </Button>
          <Button
            class="min-w-[115px] flex-1 md:w-full flex-shrink-0"
            tabIndex={1}
            onClick={async () => await commitScoreboard()}
          >
            Send Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreboardInfoContainer;
