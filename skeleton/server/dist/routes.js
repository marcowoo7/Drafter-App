"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.pick = exports.joinDraft = exports.createDraft = void 0;
var drafts = new Map(); // <K: Draft ID, V: Draft>
// Create a new draft
function createDraft(req, res) {
    var drafter = req.body.drafter;
    if (drafter === undefined || typeof drafter !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    var drafters = req.body.drafters;
    if (drafters.length === 0 || !Array.isArray(drafters)) {
        res.status(400).send("missing 'drafters' parameter");
        return;
    }
    var currPicks = { roundList: [], picks: [], drafterHistory: [] };
    var draftID = req.body.draftID;
    if (typeof draftID !== 'number' || draftID <= 0) {
        res.status(400).send("error draftID not found");
        return;
    }
    var rounds = req.body.rounds;
    if (typeof rounds !== 'number' || rounds <= 0) {
        res.status(400).send("error");
        return;
    }
    var options = req.body.options;
    if (options.length === 0 || !Array.isArray(options)) {
        res.status(400).send("missing 'options' parameter");
        return;
    }
    var draft = { drafters: drafters,
        draftID: draftID,
        rounds: rounds,
        options: options,
        currPicks: currPicks,
        currDrafter: drafter,
        nextDrafter: "" };
    drafts.set(draftID, draft);
    res.send(draft);
}
exports.createDraft = createDraft;
// Join an existing draft
function joinDraft(req, res) {
    var draftID = req.body.draftID;
    if (typeof draftID !== 'number' || draftID <= 0) {
        res.status(400).send("error draftID not found");
        return;
    }
    var draft = drafts.get(draftID);
    var drafter = first(req.body.drafter);
    if (typeof drafter !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    if (drafts.has(draftID) && draft !== undefined) {
        var drafters = draft.drafters;
        if (!drafters.includes(drafter)) {
            res.status(400).send("drafter doesn't exist");
        }
        res.send(draft);
    }
    else {
        res.status(400).send("unknown draft ID");
        return;
    }
}
exports.joinDraft = joinDraft;
// Adds the current pick to the draft
function pick(req, res) {
    var draftID = req.body.draftID;
    if (typeof draftID !== 'number' || draftID <= 0) {
        res.status(400).send("error draftID not found");
        return;
    }
    var pick = req.body.pick;
    if (pick === undefined || typeof pick !== 'string') {
        res.status(400).send("missing 'pick' parameter");
        return;
    }
    var drafter = req.body.drafter;
    if (drafter === undefined || typeof drafter !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    var draft = drafts.get(draftID);
    if (drafts.has(draftID) && draft !== undefined) {
        // pushes the current drafter
        draft.currPicks.drafterHistory.push(draft.currDrafter);
        // pushes their pick
        draft.currPicks.picks.push(pick);
        // pushes the current round
        draft.currPicks.roundList.push(draft.currPicks.picks.length);
        // determines next drafter and changes current drafter
        var newDrafter = getNextDrafter(draft.drafters, drafter);
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
    else {
        res.status(400).send("No draft ID");
    }
}
exports.pick = pick;
/**
 * Returns a new array without given string
 * @param arr string array to remove from
 * @param element string to remove
 * @returns new array without given string
 */
function removeElementFromArray(arr, element) {
    var index = arr.indexOf(element);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
// Returns the most current state of the draft
function getStatus(req, res) {
    var draftID = req.body.draftID;
    if (typeof draftID !== 'number' || draftID <= 0) {
        res.status(400).send("error draftID not found");
        return;
    }
    var draft = drafts.get(draftID);
    if (drafts.has(draftID) && draft !== undefined) {
        res.send({ draft: draft,
            nextDrafter: draft.nextDrafter,
            currDrafter: draft.currDrafter,
            currOptions: draft.options,
            picks: draft.currPicks.picks,
            drafterHistory: draft.currPicks.drafterHistory,
            currRound: draft.currPicks.roundList });
    }
    else {
        res.status(400).send("No draft ID");
    }
}
exports.getStatus = getStatus;
/**
 * Returns the next drafter given an array of drafters
 * @param choices drafter choices
 * @param currDrafter the current drafter
 * @returns the next drafter after our current one
 */
function getNextDrafter(choices, currDrafter) {
    var currIndex = choices.findIndex(function (drafter) { return drafter === currDrafter; });
    var nextIndex = (currIndex + 1) % choices.length;
    return choices[nextIndex];
}
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQSxJQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQyxDQUFDLDBCQUEwQjtBQUVuRSxxQkFBcUI7QUFDckIsU0FBZ0IsV0FBVyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ25ELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ2pDLElBQUcsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUM7UUFDcEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUNqRCxPQUFPO0tBQ1Y7SUFDRCxJQUFNLFFBQVEsR0FBYSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM3QyxJQUFHLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQztRQUNqRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3JELE9BQU87S0FDVjtJQUNELElBQU0sU0FBUyxHQUFHLEVBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNqRSxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNqQyxJQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFDO1FBQzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDaEQsT0FBTztLQUNWO0lBQ0Qs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