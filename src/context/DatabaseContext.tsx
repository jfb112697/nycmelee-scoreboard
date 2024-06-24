// DatabaseContext.tsx
import { createContext, useContext, createSignal, createEffect, JSX } from 'solid-js';
import Database from 'tauri-plugin-sql-api';

interface DbContextType {
    getSuggestions: (query: string) => Promise<string[]>;
    saveSuggestion: (suggestion: string) => Promise<void>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = (props: { children: JSX.Element }): JSX.Element => {
    const [db, setDb] = createSignal<any>(null);

    createEffect(async () => {
        const dbInstance = await Database.load('sqlite:autocomplete.db');
        setDb(dbInstance);

        // Run any necessary setup or migration tasks here if needed
        await dbInstance.execute(
            'CREATE TABLE IF NOT EXISTS playernames (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);'
        );
    });

    const getSuggestions = async (query: string): Promise<string[]> => {
        if (db()) {
            if (query === '') {
                const result = await db().select('SELECT name FROM playernames ORDER BY id DESC LIMIT 10');
                return result.map((row: { name: string }) => row.name);
            } else {
                const result = await db().select('SELECT name FROM playernames WHERE name LIKE $1', [`%${query}%`]);
                return result.map((row: { name: string }) => row.name);
            }
        }
        return [];
    };

    const saveSuggestion = async (suggestion: string): Promise<void> => {
        if (db()) {
            try {
                await db().execute('INSERT INTO playernames (name) VALUES ($1)', [suggestion]);
            } catch (error: any) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    console.log(`Suggestion "${suggestion}" already exists in the database.`);
                } else {
                    console.error("Error saving suggestion:", error);
                }
            }
        }
    };

    const value: DbContextType = {
        getSuggestions,
        saveSuggestion
    };

    return <DbContext.Provider value={value}>{props.children}</DbContext.Provider>;
};

export const useDb = (): DbContextType => {
    const context = useContext(DbContext);
    if (!context) {
        throw new Error('useDb must be used within a DbProvider');
    }
    return context;
};
