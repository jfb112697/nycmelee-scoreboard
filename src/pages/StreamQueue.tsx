import { For, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppState } from "~/context/StateContext";
import { invoke } from "@tauri-apps/api/tauri";
import { Settings } from "~/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { get } from "http";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Pronouns } from "~/enums";
import { useNavigate } from "@solidjs/router";

const TOURNAMENT_QUERY = `
  query TournamentQuery($slug: String) {
    tournament(slug: $slug) {
      id
      name
      streams {
        streamName
      }
    }
  }
`;

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
  const [streams, setStreams] = createSignal([]);
  const [selectedStream, setSelectedStream] = createSignal<string>(
    state.selectedStream
  );
  const [streamQueue, setStreamQueue] = createSignal<any>([]);
  const navigate = useNavigate();

  const settings = createMemo(() => state.settings);

  onMount(() => {
    getTournamentStreams(settings().ggTournamentSlug);
    console.log(selectedStream());
    if (selectedStream()) {
      console.log("getting stream queue");
      getStreamQueue(settings().ggTournamentSlug);
    }
  });

  createEffect(() => {
    const currentSelectedStream = selectedStream();
    if (currentSelectedStream) {
      setState((prevState) => ({
        ...prevState,
        selectedStream: currentSelectedStream,
      }));
      console.log(state);
      getStreamQueue(settings().ggTournamentSlug);
    }
  });

  createEffect(() => {
    setStreams(state.streamQueues as any);
  });

  const getTournamentStreams = async (slug: string) => {
    try {
      const query = TOURNAMENT_QUERY;
      const variables = JSON.stringify({ slug });
      const apiToken = settings().ggToken;

      if (apiToken && slug) {
        const response = await invoke("send_graphql_request", {
          apiToken: apiToken,
          query,
          variables,
        });

        const jsonResponse = JSON.parse(response as string);
        if (
          jsonResponse.data &&
          jsonResponse.data.tournament &&
          jsonResponse.data.tournament.streams
        ) {
          setStreams(jsonResponse.data.tournament.streams);
        } else {
          console.error("Error fetching events:", jsonResponse.errors);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
        const streamQueues = jsonResponse.data.tournament.streamQueue as any[];
        setState((prevState) => ({ ...prevState, streamQueues: streamQueues }));
        setStreamQueue(
          streamQueues.find(
            (stream) => stream.stream.streamName === selectedStream()
          )?.sets || []
        );
      } else {
        console.error("Error fetching events:", jsonResponse.errors);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectMatch = (set: any) => {
    setState((prevState) => ({
      ...prevState,
      scoreboard: {
        ...prevState.scoreboard,
        players: [
          {
            name: set.slots[0].entrant.name,
            sponsor: "",
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.TheyThem,
          },
          {
            name: set.slots[1].entrant.name,
            sponsor: "",
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
              and singing in to your account, clicking your icon in the bottom
              left and navigating to Developer Settings.
            </p>
          </div>
        </Card>
      ) : (
        <Card class="w-full mt-4 p-4">
          <CardHeader class="flex flex-row items-center justify-between gap-4">
            <CardTitle class="flax-shrink">Stream Queue</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant={"outline"}
                class="max-w-[200px] m-0"
                as={Button<"button">}
              >
                {selectedStream() || "Select a Stream"}
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-48">
                <For each={streams()}>
                  {(stream: any) => (
                    <DropdownMenuItem
                      onClick={() => setSelectedStream(stream.streamName)}
                    >
                      {stream.streamName}
                    </DropdownMenuItem>
                  )}
                </For>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            {!selectedStream() ? (
              <h1>No Stream Selected</h1>
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
                  <For each={streamQueue()}>
                    {(set) => (
                      <TableRow>
                        <TableCell class="font-medium">
                          {set.slots[0].entrant.name}
                        </TableCell>
                        <TableCell>{set.slots[1].entrant.name}</TableCell>
                        <TableCell>{set.fullRoundText}</TableCell>
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
