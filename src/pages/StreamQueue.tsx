import { For, createEffect, createMemo, onMount } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppState } from "~/context/StateContext";
import { invoke } from "@tauri-apps/api/tauri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Pronouns } from "~/enums";
import { useNavigate } from "@solidjs/router";

const STREAMQUEUE_QUERY = `
query TournamentQuery($slug: String) {
  tournament(slug: $slug) {
    streamQueue {
      stream {
        streamName
      }
      sets {
        fullRoundText
        slots {
          entrant {
            initialSeedNum
            name
            standing {
              placement
            }
          }
        }
      }
    }
  }
}`;

const StreamQueue = () => {
  const { state, setState } = useAppState();
  const navigate = useNavigate();

  const settings = createMemo(() => state.settings);
  const selectedStream = createMemo(() => state.selectedStream);
  const streamQueues = createMemo(() => state.streamQueues);

  const currentStreamQueue = createMemo(() =>
    streamQueues().find((queue) => queue.stream.streamName === selectedStream())
  );

  onMount(() => {
    if (settings().ggTournamentSlug && settings().ggToken) {
      getStreamQueue(settings().ggTournamentSlug);
    }
  });

  createEffect(() => {
    if (selectedStream() && streamQueues().length > 0) {
      const newCurrentQueue = streamQueues().find(
        (queue) => queue.stream.streamName === selectedStream()
      );
      if (!newCurrentQueue) {
        // If the selected stream is not in the queue, select the first available stream
        setState((prev) => ({
          ...prev,
          selectedStream: streamQueues()[0].stream.streamName,
        }));
      }
    }
  });

  const getStreamQueue = async (slug: string) => {
    try {
      const query = STREAMQUEUE_QUERY;
      const variables = JSON.stringify({ slug });
      const apiToken = settings().ggToken;

      const response = await invoke("send_graphql_request", {
        apiToken: apiToken,
        query,
        variables,
      });

      const jsonResponse = JSON.parse(response as string);
      if (
        jsonResponse.data &&
        jsonResponse.data.tournament &&
        jsonResponse.data.tournament.streamQueue
      ) {
        const streamQueues = jsonResponse.data.tournament.streamQueue;
        setState((prev) => ({
          ...prev,
          streamQueues,
          selectedStream:
            prev.selectedStream ||
            (streamQueues[0] && streamQueues[0].stream.streamName),
        }));
      } else {
        console.error("Error fetching stream queue:", jsonResponse.errors);
      }
    } catch (error) {
      console.error("Error fetching stream queue:", error);
    }
  };

  const handleSelectMatch = (set: any) => {
    setState((prevState) => ({
      ...prevState,
      scoreboard: {
        ...prevState.scoreboard,
        players: [
          {
            name:
              (set.slots[0].entrant.name.includes("|")
                ? set.slots[0].entrant.name.split(" | ")[1]
                : set.slots[0].entrant.name) || "",
            sponsor:
              (set.slots[0].entrant.name.includes("|") &&
                set.slots[0].entrant.name.split(" | ")[0]) ||
              "",
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.TheyThem,
          },
          {
            name:
              (set.slots[1].entrant.name.includes("|")
                ? set.slots[1].entrant.name.split(" | ")[1]
                : set.slots[1].entrant.name) || "",
            sponsor:
              (set.slots[1].entrant.name.includes("|") &&
                set.slots[1].entrant.name.split(" | ")[0]) ||
              "",
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.TheyThem,
          },
        ],
        round: set.fullRoundText,
      },
    }));
    navigate("/", { replace: true });
  };

  return (
    <div class="flex flex-col w-full h-full items-start justify-start p-4">
      <h1 class="text-[30px] font-extrabold">Stream Queue</h1>
      {!settings().ggToken ? (
        <Card class="w-full mt-4">
          <CardHeader>
            <CardTitle>GG API Token Required</CardTitle>
          </CardHeader>
          <div class="p-4">
            <p>
              To use the stream queue, you need to provide a GG API token. You
              can get one by visiting{" "}
              <a
                href="https://smash.gg/"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                smash.gg
              </a>
              and signing in to your account, clicking your icon in the bottom
              left and navigating to Developer Settings.
            </p>
          </div>
        </Card>
      ) : (
        <Card class="w-full mt-4 p-4">
          <CardHeader class="flex flex-row items-center justify-between gap-4">
            <CardTitle class="flex-shrink">Stream Queue</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="outline"
                class="max-w-[200px] m-0"
                as={Button<"button">}
              >
                {selectedStream() || "Select a Stream"}
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-48">
                <For each={streamQueues()}>
                  {(queue: any) => (
                    <DropdownMenuItem
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          selectedStream: queue.stream.streamName,
                        }))
                      }
                    >
                      {queue.stream.streamName}
                    </DropdownMenuItem>
                  )}
                </For>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            {!currentStreamQueue() ? (
              <h1>No Stream Selected or No Matches in Queue</h1>
            ) : (
              <Table class="border-muted-foreground border-1 rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Player 1</TableHead>
                    <TableHead>Player 2</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead class="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <For each={currentStreamQueue()?.sets}>
                    {(set) => (
                      <TableRow>
                        <TableCell class="font-medium">
                          {set.slots[0]?.entrant?.name || ""}
                        </TableCell>
                        <TableCell>
                          {set.slots[1]?.entrant?.name || ""}
                        </TableCell>
                        <TableCell>{set.fullRoundText || ""}</TableCell>
                        <TableCell class="text-right">
                          <Button onClick={() => handleSelectMatch(set)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </For>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StreamQueue;
