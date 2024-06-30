// DatabaseContext.tsx
import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  JSX,
  onMount,
} from "solid-js";
import Database from "tauri-plugin-sql-api";

interface DbContextType {
  getSuggestions: (
    query: string
  ) => Promise<{ name: string; sponsor: string }[]>;
  saveSuggestion: (name: string, sponsor: string) => Promise<void>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = (props: { children: JSX.Element }): JSX.Element => {
  const [autocompleteDb, setautocompleteDb] = createSignal<any>(null);
  onMount(async () => {
    const dbInstance = await Database.load("sqlite:autocomplete.db");
    setautocompleteDb(dbInstance);

    // Run any necessary setup or migration tasks here if needed
  });

  const getSuggestions = async (
    query: string
  ): Promise<{ name: string; sponsor: string }[]> => {
    if (autocompleteDb()) {
      let result;
      if (query === "") {
        result = await autocompleteDb().select(
          "SELECT name, sponsor FROM playernames ORDER BY id DESC LIMIT 10"
        );
      } else {
        result = await autocompleteDb().select(
          "SELECT name, sponsor FROM playernames WHERE name LIKE $1 LIMIT 10",
          [`%${query}%`]
        );
      }

      // Map the result to return the array of objects with name and sponsor
      return result.map((row: { name: string; sponsor: string }) => ({
        name: row.name,
        sponsor: row.sponsor,
      }));
    }
    return [];
  };

  const saveSuggestion = async (
    name: string,
    sponsor: string
  ): Promise<void> => {
    if (autocompleteDb()) {
      try {
        // First, attempt to insert the new player
        await autocompleteDb().execute(
          "INSERT OR IGNORE INTO playernames (name, sponsor) VALUES ($1, $2)",
          [name, sponsor]
        );

        // Then, update the sponsor if the player already exists
        await autocompleteDb().execute(
          "UPDATE playernames SET sponsor = $1 WHERE name = $2",
          [sponsor, name]
        );
      } catch (error: any) {
        console.error(`Error saving suggestion "${name}":`, error);
      }
    }
  };

  const value: DbContextType = {
    getSuggestions,
    saveSuggestion,
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
