import { createSignal, createEffect, onCleanup, onMount, Show } from "solid-js";
import { listen, once } from "@tauri-apps/api/event";
import { useAppState } from "../../context/StateContext";
import { BaseDirectory, appDataDir } from "@tauri-apps/api/path";
import { fs } from "@tauri-apps/api";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Database from "tauri-plugin-sql-api";
import { metadata } from "tauri-plugin-fs-extra-api";

const checkDatabase = async (setAge: any) => {
  const appDataPath = await appDataDir();
  const databasePath = `${appDataPath}/melee_player_database.db`;
  const exists = await fs.exists("melee_player_database.db");
  console.log("exists", exists);
  await metadata(databasePath).then((data) => {
    setAge(data.createdAt);
  });
  return exists;
};

export const InitializeDatabase = async () => {
  const { setState, state } = useAppState();
  if ((await checkDatabase) && !state.playerDbInstance) {
    Database.load(`sqlite:melee_player_database.db`).then((db) => {
      setState({ ...state, playerDbInstance: db });
    });
  }
};

const MeleePlayerDatabase = () => {
  const { state } = useAppState();
  const [age, setAge] = createSignal<any | null>(null);
  const [databaseExists, setDatabaseExists] = createSignal(
    state.playerDbInstance === null
  );
  const [tooOld, setTooOld] = createSignal(false);

  const handleDrop = async (event: any) => {
    const file = event.payload[0];
    if (file && file.endsWith("melee_player_database.db")) {
      console.log("running");
      const appDataPath = await appDataDir();
      const destinationPath = `${appDataPath}/melee_player_database.db`;

      try {
        await fs.copyFile(file, destinationPath);
        setDatabaseExists(true);
      } catch (error) {
        console.error("Failed to move file:", error);
      }
    }
  };

  onMount(async () => {
    setDatabaseExists(await checkDatabase(setAge));
    once("tauri://file-drop", handleDrop);
  });

  createEffect(() => {
    if (age() && new Date().getTime() - new Date(age()).getTime() > 604800000) {
      setTooOld(true);
    }
  });

  return (
    <div class="flex-1 space-y-4 p-6 pt-6">
      <Show when={!databaseExists() || tooOld()}>
        <Card class="w-full h-48 border-dashed border-4 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <p class="mb-2">Drop melee-player-database.db here</p>
            <p class="text-sm text-gray-500">to get head to head scores</p>
          </div>
        </Card>
      </Show>
      <Show when={databaseExists()}>
        <div>
          <p>Melee Player Database is available!</p>
          {tooOld() && (
            <p class="text-red-500">
              Database is over a week old, consider updating
            </p>
          )}
        </div>
      </Show>
    </div>
  );
};

export default MeleePlayerDatabase;
