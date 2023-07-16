import React, { ChangeEvent, Component } from "react";
import { Editor } from './editor';
import { Draft } from "./draft"

interface DraftState {
    
    // drafter that user will enter
    drafter: string;

    // page choices
    page: "home" | "picking";

    // generated draftID
    draftID: number;

    // options that user will enter
    options: string[];

    // drafter names that user will enter
    drafters: string[];

    // number of rounds that user will enter
    rounds: number;

    // current state of the draft
    draftState: Draft | "not yet created";

    // join status of draft
    joinStatus: string;

}

export class App extends Component<{}, DraftState>{
    constructor(props: any){
        super(props);
        this.state = {drafter: "", draftID: 0, page: "home", drafters: [], options: [], rounds: 0, draftState: "not yet created", joinStatus: ""};
    };

    render = (): JSX.Element => {
        if(this.state.page === "home"){
            return (<div>
                <span>Drafter: </span>
                <input type="text" onChange={this.handleDrafter}></input> <strong> (required for either option)</strong>
                <h2>Join Existing Draft</h2>
                <span>Draft ID: </span> <input type="text" onChange={this.handleDraftIDJoin}></input> 
                <button onClick={() => this.handleJoin()}>Join</button>
                <h2>Create New Draft</h2>
                <span>Rounds: </span> <input type="text" onChange={this.handleRounds}></input>
                
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <p style={{ marginBottom: "5px" }}>Options (one per line):</p>
                        <textarea onChange={this.handleTextAreaOptions} style={{ height: "300px", width: "200px" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <p style={{ marginBottom: "5px" }}>Drafters (one per line):</p>
                        <textarea onChange={this.handleTextAreaDrafters} style={{ height: "300px", width: "200px" }} />
                    </div>
                </div>
                <button onClick={() => this.handleCreate()}>Create</button>
            </div>);
        }
        else {
            return <div><Editor name={this.state.drafter} initialDraft={this.state.draftState} ></Editor></div>;
        }
    };

    handleDrafter = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({drafter: event.target.value});
    }

    handleDraftIDJoin = (event: ChangeEvent<HTMLInputElement>) => {
        const ID = parseInt(event.target.value);
        this.setState({draftID: ID});
    }

    handleJoin = (): void => {
         fetch("/api/join", {method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({drafter: this.state.drafter, draftID: this.state.draftID})
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("HTTP status " + res.status);
        }
      })
    .then(draft => this.setState({draftState: draft, page: "picking", joinStatus: ""}))
    .catch(this.handleServerError);
    }

    handleRounds = (event: ChangeEvent<HTMLInputElement>) => {
        const rounds = parseInt(event.target.value);
        this.setState({rounds: rounds});
    }

    handleTextAreaOptions = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const options = event.target.value.split("\n");
        this.setState({ options: options });
    }

    handleTextAreaDrafters = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const drafters = event.target.value.split("\n");
        this.setState({ drafters: drafters});
    }

    handleCreate = (): void => {
        if( 
        this.state.drafters.length === 0 ||
        this.state.options.length === 0 ||
        this.state.rounds === 0){
            throw new Error("Missing Parameter")
        }
        else {
            const generateID = this.getRandomInt();
            this.setState({
                draftID: generateID 
            });
            fetch("/api/create", {method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ 
                        drafter: this.state.drafter,
                        draftID: generateID,
                        drafters: this.state.drafters,
                        rounds: this.state.rounds,
                        options: this.state.options
                        })
    }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("HTTP status " + res.status);
        }
      })
      .then(draft => {
        this.setState({draftState: draft, page: "picking"});
      })
      .catch(this.handleServerError);
        }
    }

    // returns a random number
    getRandomInt(): number {
        return Math.floor(Math.random() * 10) + 1;
    }

    handleServerError = (res: Response): void => {
        console.error(res.statusText);
    }
}