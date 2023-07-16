import React, { ChangeEvent, Component } from "react";
import { Draft } from "./draft"

interface EditorProps {
    // intital state of draft
    initialDraft: Draft | string;

    // drafter name
    name: string;
}

interface EditorState {

    // name of the drafter
    enteredAs: string;

    // current state of the draft
    draftState: Draft;

    // draft ID of this draft
    draftID: number;

    // name of the next drafter
    nextDrafter: string;

    // name of the current drafter
    currDrafter: string;

    // lists all current options
    currOptions: string[];

    // option that the drafter picked
    selectedPick: string;

    // number array of current rounds
    currRound: number[];

    // keeps track of the picks
    picks: string[];

    // keeps track of the drafter that made the pick
    drafterHistory: string[]

}

export class Editor extends Component<EditorProps, EditorState>{

    constructor(props: any){
        super(props);
        if(typeof this.props.initialDraft === 'string'){
            throw new Error(this.props.initialDraft);
        }
        const name = this.props.name;
        const draft = this.props.initialDraft;
        this.state = {enteredAs: name,
                        draftState: draft,
                        draftID: draft.draftID, 
                        nextDrafter: "", 
                        currDrafter: draft.drafters[0], 
                        currRound: draft.currPicks.roundList, 
                        currOptions: draft.options, 
                        selectedPick: draft.options[0],
                        picks: draft.currPicks.picks,
                        drafterHistory: draft.currPicks.drafterHistory};
    }

render = (): JSX.Element =>{
    const id: number = this.state.draftID;
    let listPicks;
    let turn;
    if(this.state.currDrafter === this.state.enteredAs){
        turn = <div>
        <p>It's your pick!</p>
        <select onChange={(event) => this.handleOptionChoice(event)}>
  <option value="">
    Choose a pick!
  </option>
  {this.state.currOptions.map((option, index) => (
    <option key={index} value={option}>
      {option}
    </option>
  ))}
</select>
    <button onClick={this.handlePick}>Pick</button>
    </div>
    }
    else{
        turn = <div>
                <p>Waiting for {this.state.currDrafter} to pick</p>
                <button onClick={() => this.handleRefresh()}>Refresh</button>
            </div>
    }
    if(this.state.currRound.length === 0){
        listPicks = <p>No Picks Made Yet.</p>
    }
    else {
        listPicks = <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
        <strong style={{ marginBottom: "5px", marginRight: "20px" }}>Num</strong>
        {this.renderRoundList()}
        </div>
        <div>
        <strong style={{ marginBottom: "5px", marginRight: "20px" }}>Pick</strong>
        {this.renderPickList()}
        </div>
        <div>
        <strong style={{ marginBottom: "5px", marginRight: "20px" }}>Drafter</strong>
        {this.renderDrafterList()}
        </div>
        </div>;
    }
    const maxRounds = this.state.draftState.rounds * this.state.draftState.drafters.length;
    if(this.state.currOptions.length === 0 || this.state.currRound.length === maxRounds){
        turn = <p>Draft is Complete!</p>
    }

    return <div><h2>Status of Draft {"\"" + id + "\""}</h2>
                {listPicks}
                {turn}
        </div>;

    
}

// prints out all current rounds
renderRoundList = (): JSX.Element[] => {
    const roundList = [];
    const currRound = this.state.currRound;
    for (let i = 0; i < this.state.currRound.length; i++) {
        roundList.push(<div key={i}>{currRound[i]}</div>);
    }
    return roundList;
    };

// prints out the history of picks
renderPickList = (): JSX.Element[] => {
    const pickList = [];
    const picks = this.state.picks;
    
    for (let i = 0; i < picks.length; i++) {
        pickList.push(<div key={i}>{picks[i]}</div>);
    }
    return pickList;
};

// prints out the drafter history
renderDrafterList = (): JSX.Element[] => {
    const drafterList = [];
    const drafters = this.state.drafterHistory;
    
    for (let i = 0; i < drafters.length; i++) {
        drafterList.push(<div key={i}>{drafters[i]}</div>);
    }
    return drafterList;
};

handleOptionChoice = (event: ChangeEvent<HTMLSelectElement>): void => {
    const option = event.target.value;
    this.setState({selectedPick: option})
};

handlePick = (): void => {
    fetch("/api/pick", {method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({draftID: this.state.draftID, 
                        pick: this.state.selectedPick, 
                        drafter: this.state.enteredAs})
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("HTTP status " + res.status);
        }
      })
    .then(data => {
        this.setState({
            currDrafter: data.currDrafter,
            nextDrafter: data.nextDrafter,
            currOptions: data.currOptions,
            selectedPick: data.currOptions[0],
            picks: data.picks,
            drafterHistory: data.drafterHistory,
            currRound: data.currRound,
            });
    })
    .catch(this.handleServerError);
};

handleRefresh = (): void => {
    
    fetch("/api/getStatus", {method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({draftID: this.state.draftID})
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("HTTP status " + res.status);
        }
      })
    .then(data => {
        this.setState({draftState: data.draft,
                        nextDrafter: data.nextDrafter,
                        currDrafter: data.currDrafter,
                        currOptions: data.currOptions,
                        selectedPick: data.currOptions[0],
                        picks: data.picks,
                        drafterHistory: data.drafterHistory,
                        currRound: data.currRound,
                        });
    })
    .catch(this.handleServerError);
}

handleServerError = (res: Response): void => {
    console.error(res.statusText);
}
}