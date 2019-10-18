import React from "react";
// import { Map, fromJS } from 'immutable'
// import { Value } from 'slate'
import Plain from "slate-plain-serializer";
import { Editor } from "slate-react";
import BridgeManager from "../lib/BridgeManager";
import { initialValue, initialNote } from "../lib/utils";

// const log = (...arg) => { if (lEnab) { console.log(...arg) } }, lEnab = true

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    console.clear();
    this.state = { slateValue: initialValue };
    this.lastSNNote = initialNote;

    // Pass to the SN API our callback function (see below)
    BridgeManager.get().addUpdateObserver(this.handleUpdateFromSN);
  }

  // Resets the editor's state when a change comes from SN
  // A totally in place callback function.
  handleUpdateFromSN = () => {
    var noteFromSN = BridgeManager.get().getNote();
    if (this.lastSNNote == initialNote) {
      this.setState({ slateValue: this.snToSlate(noteFromSN) });
    }
    this.lastSNNote = noteFromSN;
  };

  // Resets the editor's state when a change is made in Slate.
  // @param { Value } value
  handleEditFromSlate = change => {
    let str = this.slateToSN(change.value);
    if (str) {
      BridgeManager.get().saveNote(str);
      this.setState({ slateValue: change.value });
    }
  };

  // Converts a SN note to a Slate Value
  snToSlate = note => {
    if (!note) {
      return initialValue;
    }
    var newValue = Plain.deserialize(note.content.text);
    newValue = newValue.set("selection", this.state.slateValue.selection);
    return newValue;
  };

  // Converts a Slate Value object to a string that
  // can be passed to SN. As above, will try to implement
  // that functionality myself.
  slateToSN = value => {
    return Plain.serialize(value);
  };

  render() {
    return (
      <div>
        <Editor
          value={this.state.slateValue}
          onChange={this.handleEditFromSlate}
        />
      </div>
    );
  }
}
