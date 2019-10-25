import React from "react";
// import { Map, fromJS } from 'immutable'
// import { Value } from 'slate'
import Plain from "slate-plain-serializer";
import { Editor } from "slate-react";
import BridgeManager from "../lib/BridgeManager";
import { initialValue, initialNote } from "../lib/utils";

const log = (...arg) => { if (lEnab) { console.log(...arg) } }, lEnab = true

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.clear();
    // Get defined defaults for Slate Value and SN Note
    this.state = { slateValue: initialValue };
    this.lastSNNote = initialNote;
    // Pass to the SN API our callback function (see below)
    BridgeManager.get().addUpdateObserver(this.handleUpdateFromSN);
  }

  /*
   * Resets the editor's state when a change comes from SN
   * A totally in place callback function.
   */
  handleUpdateFromSN = () => {
    var noteFromSN = BridgeManager.get().getNote();
    if (this.lastSNNote == initialNote) {
      this.setState({ slateValue: this.snToSlate(noteFromSN) });
    }
    this.lastSNNote = noteFromSN;
  };

  /*
   * Resets the editor's state when a change is made in Slate.
   * @param     { Map }         change
   * @param     { Value }       change.value
   * @param     { [ Operation ] }   change.operation
   */
  handleEditFromSlate = change => {
    let str = this.slateToSN(change.value);
    log(change.operations.map(op => op.type).toArray())
    if (str) {
      BridgeManager.get().saveNote(str);
      this.setState({ slateValue: change.value });
    }
  };

  /*
   * Converts a SN note to a Slate Value
   * @param     { Object }      note
   * @return    { Value }       value with note in it
   */
  snToSlate = note => {
    if (note) {
      var newVal = Plain.deserialize(note.content.text);
      return newVal.set("selection", this.state.slateValue.selection);
    } else {
      return initialValue;
    }
  };

  /*
   * Converts a Slate Value to a SN note
   * As above, will try to implement that myself.
   * @param     { Value }       value
   * @return    { String }      str the editor's contents
   */
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
