// src/types.d.ts
export interface Player {
    name: string;
    character: string;
    sponsor: string | null;
    score: number;
    h2hWins: number;
    pronouns: string;
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
    Player1: Player;
    Player2: Player;
    round: string | null;
    bracket: string | null;
    bestof: string | null;
    tournamentName: string | null;
    caster: string | null;
    streamer: string | null;
    ticker1: string | null;
    ticker2: string | null;
    ticker3: string | null;
    ticker4: string | null;
    ticker5: string | null;
    twitchclip: string | null;
    Commentators: string | null;
    Comm1Name: string | null;
    Comm2Name: string | null;
    Comm3Name: string | null;
    Comm4Name: string | null;
    Comm1Twitter: string | null;
    Comm2Twitter: string | null;
    Comm3Twitter: string | null;
    Comm4Twitter: string | null;
    BreakRow1: string | null;
    BreakRow2: string | null;
    BreakRow3: string | null;
    P1TitleSE: string | null;
    P2TitleSE: string | null;
    P3TitleSE: string | null;
    P4TitleSE: string | null;
    P5TitleSE: string | null;
    P6TitleSE: string | null;
    P1NameSE: string | null;
    P2NameSE: string | null;
    P3NameSE: string | null;
    P4NameSE: string | null;
    P5NameSE: string | null;
    P6NameSE: string | null;
    Crew1Name: string | null;
    Crew2Name: string | null;
    Crew1P1Name: string | null;
    Crew1P1Stock: number;
    Crew1P2Name: string | null;
    Crew1P2Stock: number;
    Crew1P3Name: string | null;
    Crew1P3Stock: number;
    Crew1P4Name: string | null;
    Crew1P4Stock: number;
    Crew2P1Name: string | null;
    Crew2P1Stock: number;
    Crew2P2Name: string | null;
    Crew2P2Stock: number;
    Crew2P3Name: string | null;
    Crew2P3Stock: number;
    Crew2P4Name: string | null;
    Crew2P4Stock: number;
    countdown: string | null;
    Smashgg: Smashgg;
    lowerThird: LowerThird;
}
