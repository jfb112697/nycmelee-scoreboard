// DatabaseContext.tsx
import {
  createContext,
  useContext,
  createSignal,
  onMount,
  JSX,
} from "solid-js";
import Database from "tauri-plugin-sql-api";

interface DbContextType {
  getSuggestions: (
    query: string,
  ) => Promise<{ name: string; sponsor: string }[]>;
  saveSuggestion: (name: string, sponsor: string) => Promise<void>;
  getPlayers: (
    page: number,
    pageSize: number,
  ) => Promise<{ name: string; sponsor: string }[]>;
  addManyPlayers: (
    players: { name: string; sponsor: string }[],
  ) => Promise<void>;
  removePlayer: (name: string) => Promise<void>;
  updatePlayer: (
    oldName: string,
    newName: string,
    newSponsor: string,
  ) => Promise<void>;
  getTotalPlayersCount: () => Promise<number>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = (props: { children: JSX.Element }): JSX.Element => {
  const [autocompleteDb, setAutocompleteDb] = createSignal<any>(null);

  onMount(async () => {
    const dbInstance = await Database.load("sqlite:autocomplete.db");
    setAutocompleteDb(dbInstance);

    // Ensure the table exists
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS playernames (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        sponsor TEXT
      )
    `);
  });

  const getSuggestions = async (
    query: string,
  ): Promise<{ name: string; sponsor: string }[]> => {
    if (autocompleteDb()) {
      let result;
      if (query === "") {
        result = await autocompleteDb().select(
          "SELECT name, sponsor FROM playernames ORDER BY id DESC LIMIT 10",
        );
      } else {
        result = await autocompleteDb().select(
          "SELECT name, sponsor FROM playernames WHERE name LIKE $1 LIMIT 10",
          [`%${query}%`],
        );
      }
      return result;
    }
    return [];
  };

  const saveSuggestion = async (
    name: string,
    sponsor: string,
  ): Promise<void> => {
    if (autocompleteDb()) {
      try {
        await autocompleteDb().execute(
          "INSERT OR REPLACE INTO playernames (name, sponsor) VALUES ($1, $2)",
          [name, sponsor],
        );
      } catch (error: any) {
        console.error(`Error saving suggestion "${name}":`, error);
      }
    }
  };

  const getPlayers = async (
    page: number,
    pageSize: number,
  ): Promise<{ name: string; sponsor: string }[]> => {
    if (autocompleteDb()) {
      const offset = (page - 1) * pageSize;
      const result = await autocompleteDb().select(
        "SELECT name, sponsor FROM playernames ORDER BY name LIMIT $1 OFFSET $2",
        [pageSize, offset],
      );
      return result;
    }
    return [];
  };

  const addManyPlayers = async (
    players: { name: string; sponsor: string }[],
  ): Promise<void> => {
    if (autocompleteDb()) {
      const db = autocompleteDb();
      await db.execute("BEGIN TRANSACTION");
      try {
        for (const player of players) {
          await db.execute(
            "INSERT OR REPLACE INTO playernames (name, sponsor) VALUES ($1, $2)",
            [player.name, player.sponsor],
          );
        }
        await db.execute("COMMIT");
      } catch (error) {
        await db.execute("ROLLBACK");
        console.error("Error adding players:", error);
        throw error;
      }
    }
  };

  const removePlayer = async (name: string): Promise<void> => {
    if (autocompleteDb()) {
      await autocompleteDb().execute(
        "DELETE FROM playernames WHERE name = $1",
        [name],
      );
    }
  };

  const updatePlayer = async (
    oldName: string,
    newName: string,
    newSponsor: string,
  ): Promise<void> => {
    if (autocompleteDb()) {
      await autocompleteDb().execute(
        "UPDATE playernames SET name = $1, sponsor = $2 WHERE name = $3",
        [newName, newSponsor, oldName],
      );
    }
  };

  const getTotalPlayersCount = async (): Promise<number> => {
    if (autocompleteDb()) {
      const result = await autocompleteDb().select(
        "SELECT COUNT(*) as count FROM playernames",
      );
      return result[0].count;
    }
    return 0;
  };

  const value: DbContextType = {
    getSuggestions,
    saveSuggestion,
    getPlayers,
    addManyPlayers,
    removePlayer,
    updatePlayer,
    getTotalPlayersCount,
  };

  return (
    <DbContext.Provider value={value}>{props.children}</DbContext.Provider>
  );
};

export const useDb = (): DbContextType => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
};
