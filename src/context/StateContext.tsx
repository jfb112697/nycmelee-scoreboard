// src/context/StateContext.tsx
import { createContext, useContext, createSignal, Accessor, Setter, createEffect } from 'solid-js';
import { invoke } from '@tauri-apps/api';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';

import { State, Scoreboard } from '../types';
import { Pronouns } from '../enums';

const initialState: State = {
    scoreboard: {
        players: [{
            name: "Red Squirrel",
            sponsor: null,
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.HeHim
        }, {
            name: "Brando",
            sponsor: null,
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.HeHim

        }],
        Player1: {
            name: "Red Squirrel",
            sponsor: null,
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.HeHim

        },
        Player2: {
            name: "Brando",
            sponsor: null,
            score: 0,
            h2hWins: 0,
            pronouns: Pronouns.HeHim

        },
        round: "You need a round for the overlay to not crash",
        bracket: null,
        bestof: null,
        tournamentName: null,
        Commentators: [{ name: "Commentator 1", twitter: "twitter.com" }, { name: "Commentator 2", twitter: "twitter.com" }],
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
    secrets: {
    }
};

const StateContext = createContext<{
    state: Accessor<State>;
    setState: Setter<State>;
    updateState: (newState: Partial<Scoreboard>) => void;
    commitScoreboard: () => void;
} | undefined>(undefined);

export function StateProvider(props: { children: any }) {
    const [state, setState] = createSignal<State>(initialState);
    const [charactersLoaded, setCharactersLoaded] = createSignal(false);


    const updateState = (newScoreboardState: Partial<Scoreboard>) => {
        setState(prevState => ({
            ...prevState,
            scoreboard: { ...prevState.scoreboard, ...newScoreboardState }
        }));
    }

    const commitScoreboard = async () => {
        await invoke("update_response", { newResponse: JSON.stringify(state().scoreboard) });
    };

    commitScoreboard();


    createEffect(async () => {
        if (charactersLoaded()) return; // Exit if characters are already loaded

        const characters = state().characters;
        if (!characters) return;

        let updated = false;
        const updatedCharacters = await Promise.all(characters.map(async (character) => {
            if (!character.url) {
                const imagePath = `icons/${character.name}/0.png`; // Assuming the image is named "0.png" within the character's folder
                let uint8Array;
                try {
                    uint8Array = await readBinaryFile(imagePath, { dir: BaseDirectory.AppData });
                }
                catch {
                    console.log("Failed to load image for character", character.name);
                    return character;
                }
                console.log(character.path, uint8Array);
                const objectURL = URL.createObjectURL(
                    new Blob([uint8Array], { type: 'image/png' })
                );
                updated = true;
                return { ...character, url: objectURL }; // Update character with URL
            }
            return character;
        }));

        if (updated) {
            setState({ ...state(), characters: updatedCharacters });
            setCharactersLoaded(true); // Prevent further updates
        }
    });


    return (
        <StateContext.Provider value={{ state, setState, updateState, commitScoreboard }}>
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