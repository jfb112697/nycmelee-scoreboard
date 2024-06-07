// src/context/StateContext.tsx
import { createContext, useContext, createSignal } from 'solid-js';
import { State } from '../types';
import { invoke } from '@tauri-apps/api';

const initialState: State = {
    Player1: {
        name: "Red Squirrel",
        character: "Fox",
        sponsor: null,
        score: 0,
        h2hWins: 0,
        pronouns: "It/Its",
    },
    Player2: {
        name: "FIREEXE",
        character: "Falco",
        sponsor: null,
        score: 0,
        h2hWins: 0,
        pronouns: "It/Its",
    },
    round: null,
    bracket: null,
    bestof: null,
    tournamentName: null,
    caster: null,
    streamer: null,
    ticker1: null,
    ticker2: null,
    ticker3: null,
    ticker4: null,
    ticker5: null,
    twitchclip: null,
    Commentators: null,
    Comm1Name: null,
    Comm2Name: null,
    Comm3Name: null,
    Comm4Name: null,
    Comm1Twitter: null,
    Comm2Twitter: null,
    Comm3Twitter: null,
    Comm4Twitter: null,
    BreakRow1: null,
    BreakRow2: null,
    BreakRow3: null,
    P1TitleSE: null,
    P2TitleSE: null,
    P3TitleSE: null,
    P4TitleSE: null,
    P5TitleSE: null,
    P6TitleSE: null,
    P1NameSE: null,
    P2NameSE: null,
    P3NameSE: null,
    P4NameSE: null,
    P5NameSE: null,
    P6NameSE: null,
    Crew1Name: null,
    Crew2Name: null,
    Crew1P1Name: null,
    Crew1P1Stock: 4.0,
    Crew1P2Name: null,
    Crew1P2Stock: 4.0,
    Crew1P3Name: null,
    Crew1P3Stock: 4.0,
    Crew1P4Name: null,
    Crew1P4Stock: 4.0,
    Crew2P1Name: null,
    Crew2P1Stock: 4.0,
    Crew2P2Name: null,
    Crew2P2Stock: 4.0,
    Crew2P3Name: null,
    Crew2P3Stock: 4.0,
    Crew2P4Name: null,
    Crew2P4Stock: 4.0,
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
};

const StateContext = createContext<{ state: State; setState: (state: State) => void } | undefined>(undefined);

export function StateProvider(props: { children: any }) {
    const [state, setState] = createSignal(initialState);

    const updateState = (newState: State) => {
        setState(newState);
        invoke('update_response', { newResponse: JSON.stringify(newState) });
    };

    return (
        <StateContext.Provider value={{ state: state(), setState: updateState }}>
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
