import { createSignal, createEffect, For } from "solid-js";
import { useDb } from "~/context/DatabaseContext";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Pagination,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import { useAppState } from "~/context/StateContext";
import { invoke } from "@tauri-apps/api/tauri";

const Players = () => {
  const db = useDb();
  const { state } = useAppState();
  const [players, setPlayers] = createSignal<
    { name: string; sponsor: string }[]
  >([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);
  const [newPlayerName, setNewPlayerName] = createSignal("");
  const [newPlayerSponsor, setNewPlayerSponsor] = createSignal("");
  const [importing, setImporting] = createSignal(false);
  const pageSize = 5;

  const loadPlayers = async () => {
    const fetchedPlayers = await db.getPlayers(currentPage(), pageSize);
    setPlayers(fetchedPlayers);

    const totalCount = await db.getTotalPlayersCount();
    setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
  };

  createEffect(() => {
    loadPlayers();
  });

  const handleAddPlayer = async () => {
    if (newPlayerName()) {
      await db.saveSuggestion(newPlayerName(), newPlayerSponsor());
      setNewPlayerName("");
      setNewPlayerSponsor("");
      loadPlayers();
    }
  };

  const handleRemovePlayer = async (name: string) => {
    await db.removePlayer(name);
    loadPlayers();
  };

  const handleUpdatePlayer = async (
    oldName: string,
    newName: string,
    newSponsor: string,
  ) => {
    await db.updatePlayer(oldName, newName, newSponsor);
    loadPlayers();
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages()) {
      setCurrentPage(page);
      loadPlayers();
    }
  };

  const importEntrants = async () => {
    const settings = state.settings;
    const slug = settings.ggTournamentSlug;
    const apiToken = settings.ggToken;

    if (!slug || !apiToken) {
      console.error("Missing tournament slug or API token");
      return;
    }

    setImporting(true);

    try {
      let page = 1;
      let totalPages = 1;
      const allPlayers: { name: string; sponsor: string }[] = [];

      while (page <= totalPages) {
        const query = `
          query TournamentQuery($slug: String, $page: Int, $perPage: Int) {
            tournament(slug: $slug) {
              events {
                entrants(query: { page: $page, perPage: $perPage }) {
                  pageInfo {
                    totalPages
                  }
                  nodes {
                    name
                  }
                }
              }
            }
          }
        `;

        const variables = JSON.stringify({ slug, page, perPage: 50 });

        const response = await invoke("send_graphql_request", {
          apiToken: apiToken,
          query,
          variables,
        });

        console.log(response);

        const jsonResponse = JSON.parse(response as string);
        if (
          jsonResponse.data &&
          jsonResponse.data.tournament &&
          jsonResponse.data.tournament.events
        ) {
          const events = jsonResponse.data.tournament.events;

          for (const event of events) {
            const entrants = event.entrants;
            totalPages = entrants.pageInfo.totalPages;

            for (const entrant of entrants.nodes) {
              const nameParts = entrant.name.split(" | ");
              const name = nameParts.length > 1 ? nameParts[1] : nameParts[0];
              const sponsor = nameParts.length > 1 ? nameParts[0] : "";
              allPlayers.push({ name, sponsor });
            }
          }
        } else {
          console.error("Error fetching entrants:", jsonResponse.errors);
        }

        page++;
      }

      await db.addManyPlayers(allPlayers);
      loadPlayers();
    } catch (error) {
      console.error("Error importing entrants:", error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div class="flex flex-col gap-4 p-4">
      <h1 class="text-3xl font-bold">Players Database</h1>

      {!state.settings.ggToken || !state.settings.ggTournamentSlug ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex gap-2">
              <TextField>
                <TextFieldInput
                  type="text"
                  placeholder="Player Name"
                  value={newPlayerName()}
                  onInput={(e) => setNewPlayerName(e.currentTarget.value)}
                />
              </TextField>
              <TextField>
                <TextFieldInput
                  type="text"
                  placeholder="Sponsor"
                  value={newPlayerSponsor()}
                  onInput={(e) => setNewPlayerSponsor(e.currentTarget.value)}
                />
              </TextField>
              <Button onClick={handleAddPlayer}>Add Player</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Import Players</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={importEntrants} disabled={importing()}>
              {importing() ? "Importing..." : "Import Entrants"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Players List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={players()}>
                {(player) => (
                  <TableRow>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.sponsor}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemovePlayer(player.name)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>

          <div class="mt-4 flex justify-center">
            <Pagination
              count={totalPages()}
              itemComponent={(props) => (
                <PaginationItem
                  page={props.page}
                  onClick={() => handlePageChange(props.page)}
                >
                  {props.page}
                </PaginationItem>
              )}
              ellipsisComponent={() => <PaginationEllipsis />}
            >
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage() - 1, 1))}
              />
              <PaginationItems />
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage() + 1, totalPages()))
                }
              />
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Players;
