import { Request, Response } from "express";

// RI: # of options >= # of drafters
export type Draft = {
    drafters: string[];
    draftID: number;
    rounds: number;
    options: string[];
    currPicks: {roundList: number[], picks: string[], drafterHistory: string[]};
    currDrafter: string;
    nextDrafter: string
}

const drafts = new Map<number, Draft>(); // <K: Draft ID, V: Draft>

// Create a new draft
export function createDraft(req: Request, res: Response){
    const drafter = req.body.drafter;
    if(drafter === undefined || typeof drafter !== 'string'){
        res.status(400).send("missing 'name' parameter");
        return;
    }
    const drafters: string[] = req.body.drafters;
    if(drafters.length === 0 || !Array.isArray(drafters)){
        res.status(400).send("missing 'drafters' parameter");
        return;
    }
    const currPicks = {roundList: [], picks: [], drafterHistory: []};
    const draftID = req.body.draftID;
    if(typeof draftID !== 'number' || draftID <= 0){
        res.status(400).send("error draftID not found");
        return;
    }
    const rounds = req.body.rounds;
    if(typeof rounds !== 'number' || rounds <= 0){
        res.status(400).send("error");
        return;
    }
    const options = req.body.options;
    if(options.length === 0 || !Array.isArray(options)){
        res.status(400).send("missing 'options' parameter");
        return;
    }
    const draft: Draft = {drafters: drafters, 
                            draftID: draftID, 
                            rounds: rounds, 
                            options: options, 
                            currPicks: currPicks, 
                            currDrafter: drafter,
                            nextDrafter: ""};
    drafts.set(draftID, draft);
    res.send(draft);
}

// Join an existing draft
export function joinDraft(req: Request, res: Response){
    const draftID = req.body.draftID;
    if(typeof draftID !== 'number' || draftID <= 0){
        res.status(400).send("error draftID not found");
        return;
    }
    const draft = drafts.get(draftID);
    const drafter = first(req.body.drafter);
    if(typeof drafter !== 'string'){
        res.status(400).send("missing 'name' parameter");
        return;
    }
    if(drafts.has(draftID) && draft !== undefined){
        const drafters = draft.drafters;
        if(!drafters.includes(drafter)){
            res.status(400).send("drafter doesn't exist")
        }
        res.send(draft);
    }
    else{
        res.status(400).send("unknown draft ID");
        return;
    }
}

// Adds the current pick to the draft
export function pick(req: Request, res: Response){
    const draftID = req.body.draftID;
    if(typeof draftID !== 'number' || draftID <= 0){
        res.status(400).send("error draftID not found");
        return;
    }
    const pick = req.body.pick;
    if(pick ===  "" || typeof pick !== 'string'){
        res.status(400).send("missing 'pick' parameter");
        return;
    }
    const drafter = req.body.drafter;
    if(drafter === undefined || typeof drafter !== 'string'){
        res.status(400).send("missing 'name' parameter");
        return;
    }
    const draft = drafts.get(draftID);
    if(drafts.has(draftID) && draft !== undefined){
        // pushes the current drafter
        draft.currPicks.drafterHistory.push(draft.currDrafter);
        // pushes their pick
        draft.currPicks.picks.push(pick);
        // pushes the current round
        draft.currPicks.roundList.push(draft.currPicks.picks.length);
        // determines next drafter and changes current drafter
        const newDrafter = getNextDrafter(draft.drafters, drafter)
        draft.nextDrafter = getNextDrafter(draft.drafters, newDrafter);
        draft.currDrafter = newDrafter;
        draft.options = removeElementFromArray(draft.options, pick);
        res.send({
                currDrafter: draft.currDrafter,
                nextDrafter: draft.nextDrafter,
                currOptions: draft.options,
                picks: draft.currPicks.picks,
                drafterHistory: draft.currPicks.drafterHistory,
                currRound: draft.currPicks.roundList
            });
    }
    else{
        res.status(400).send("No draft ID")
    }
    
}

/**
 * Returns a new array without given string
 * @param arr string array to remove from
 * @param element string to remove
 * @returns new array without given string
 */
function removeElementFromArray(arr: string[], element: string): string[] {
    const index = arr.indexOf(element);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

// Returns the most current state of the draft
export function getStatus(req: Request, res: Response){
    const draftID = req.body.draftID;
    if(typeof draftID !== 'number' || draftID <= 0){
        res.status(400).send("error draftID not found");
        return;
    }
    const draft = drafts.get(draftID);
    if(drafts.has(draftID) && draft !== undefined){
        res.send({draft: draft,
            nextDrafter: draft.nextDrafter, 
            currDrafter: draft.currDrafter,
            currOptions: draft.options,
            picks: draft.currPicks.picks,
            drafterHistory: draft.currPicks.drafterHistory,
            currRound: draft.currPicks.roundList});
    }
    else{
        res.status(400).send("No draft ID")
    }  
}

/**
 * Returns the next drafter given an array of drafters
 * @param choices drafter choices
 * @param currDrafter the current drafter
 * @returns the next drafter after our current one
 */
function getNextDrafter(choices: string[], currDrafter: string): string{
  const currIndex = choices.findIndex(drafter => drafter === currDrafter);
  const nextIndex = (currIndex + 1) % choices.length;
  return choices[nextIndex];
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
    if (Array.isArray(param)) {
      return first(param[0]);
    } else if (typeof param === 'string') {
      return param;
    } else {
      return undefined;
    }
  }
  

