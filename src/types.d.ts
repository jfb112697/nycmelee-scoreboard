// src/types.d.ts
import {
    Pronouns

} from "./enums";
export interface Character {
    name: string,
    url?: string = "",
    path: string,
}

export interface Player {
    name: string;
    character?: Character;
    sponsor: string | null;
    score: number;
    h2hWins: number;
    pronouns: Pronouns;
}

export interface LowerThird {
    LeftAnnotationText: string;
    Text1: string;
    Text2: string | null;
    TitleText: string | null;
    ClockText: string | null;
    Music: string | null;
    Compact: boolean;
    Commentary: boolean;
}

export interface Smashgg {
    slug: string | null;
    streamQueue: string | null;
}

export interface State {
    characters: Character[] | null;
    secrets: any | null
    scoreboard: Scoreboard;
}
export interface Scoreboard {
    players: Player[] = [
    { name: 'Jeremy', character: '', sponsor: "", score: 0, h2hWins: 0, pronouns: Pronouns.HeHim},
    { name: 'Brando', character: '', sponsor: "", score: 0, h2hWins: 0, pronouns: Pronouns.HeHim}
    ];
    Player1: Player;
    Player2: Player;
    round: string | null;
    bracket: string | null;
    bestof: string | null;
    tournamentName: string | null;
    Commentators: ({ name: string; twitter: string; } | null)[];
    BreakRow1: string | null;
    BreakRow2: string | null;
    BreakRow3: string | null;
    countdown: string | null;
    Smashgg: Smashgg;
    lowerThird: LowerThird;

}
