
export type Draft = {
    drafters: string[];
    draftID: number;
    rounds: number;
    options: string[];
    currPicks: {roundList: number[], picks: string[], drafterHistory: string[]}; // <K: Drafter, V: their drafts>
    currDrafter: string;
    nextDrafter: string;
};