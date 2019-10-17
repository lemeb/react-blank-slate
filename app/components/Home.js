import React from 'react'
import { Map, fromJS } from 'immutable'
import { Editor } from 'slate-react'
// import { Value } from 'slate'
import Plain from 'slate-plain-serializer'
import BridgeManager from '../lib/BridgeManager'
import { timestampString, initialValue, initialNote } from '../lib/utils'

const log = (...args) => { if (lEnab) { console.log(...args) } }, lEnab = true
const e = { note: '🗒', write: '✍', }

export default class Home extends React.Component {
  constructor(props) {
    super(props)

    console.clear()
    this.state = { slateValue: initialValue }
    this.lastSNNote = initialNote

    // Resets the editor's state when a change comes from SN
    // A totally in place callback function.
    this.handleUpdateFromSN = () => {
      var noteFromSN = BridgeManager.get().getNote()
      // LOG THAT WE RECIEVED UPDATE FROM SN Ø
      log(                                                               // Ø
        '→ UPDATE FROM SN -- handleUpdateFromSN()\n',                    // Ø
        ` Retrieved from SN → ${e.note} with title`,                     // Ø
        ` '${noteFromSN.content.title}'\n`,                              // Ø
        ` updated   ${timestampString(noteFromSN.updated_at)}\n`,        // Ø
        ` right_now ${timestampString()}`,                               // Ø
        '\n', {text: noteFromSN.content.text},                           // Ø
        // '\n', noteFromSN,                                                // Ø
      )                                                                  // Ø
      // Ø
      if (this.lastSNNote == initialNote) {
        this.lastSNNote = this.snToSlate(noteFromSN)
        this.setState(() => {
          return { slateValue: this.snToSlate(noteFromSN) }
        }) 
      }
    }

    // Pass to the SN API our callback function (see below)
    BridgeManager.get().addUpdateObserver(this.handleUpdateFromSN)

    // Resets the editor's state when a change is made in Slate.
    // @param { Value } value
    this.handleEditFromSlate = (change) => {
      let value = change.value
      let str = this.slateToSN(value)
      // LOG THAT WE RECIEVED EDIT FROM SLATE Ø
      let old_props = change.operations.get(0).get('properties')
      let new_props = change.operations.get(0).get('newProperties')
      log(                                                               // Ø
        '→ EDIT FROM SLATE -- handleEditFromSlate()\n',                  // Ø
        ` right_now ${timestampString()}`,                               // Ø
        '\n', {text: str}, '\n', change,                                 // Ø
        '\n ops: ', change.operations.get(0),                            // Ø
        '\n opsI: ', fromJS(change.operations.get(0)),                   // Ø
        '\n map?: ', Map.isMap(old_props),                               // Ø
        '\n mapI: ', fromJS(old_props),                                  // Ø
        '\n old props: ', old_props, '\n new props: ', new_props,        // Ø
        // '\n equals? ', old_props.equals(new_props),                      // Ø
      )                                                                  // Ø
      // Ø
      if (str) {
        BridgeManager.get().saveNote(str)
        this.setState({
          slateValue: value
        })
      }
    }

    log('constructing')
    log('initialValue', this.state.slateValue)
  }

  // Converts a SN note to a Slate Value
  snToSlate = note => {
    if (!note) {
      log('NO NOTE', initialValue, note)
      return initialValue
    }
    // TODO: Remove this dependency,
    // and implement the deserialization by itself.
    // Esp. important given that Slate is still in Beta.
    var newValue = Plain.deserialize(note.content.text)
    log('NEW VALUE!', newValue, newValue.selection)
    newValue = newValue.set('selection', this.state.slateValue.selection)
    return newValue
  }

  // Converts a Slate Value object to a string that
  // can be passed to SN. As above, will try to implement
  // that functionality myself.
  slateToSN = value => {
    return Plain.serialize(value)
  }

  /* saveNote = () => {
    let note = this.
  } */

  // updateslateValueue(note){}

  render() {
    return (
      <div>
        <Editor
          value={this.state.slateValue}
          onChange={this.handleEditFromSlate}
        />
        {/* this.state.note && (
            <div>
              <p>
                Working note title:{" "}
                <strong>{this.state.note.content.title}</strong>
              </p>
              <p>
                Working note content:{" "}
                <strong>{this.state.note.content.text}</strong>
              </p>
            </div>
          ) */}
      </div>
    )
  }
}
