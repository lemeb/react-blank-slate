import ComponentManager from './componentManager.js'
import { timestampString, initialNote } from '../lib/utils'

const log = (...args) => { if (lEnab) { console.log(...args) } }, lEnab = true

export default class BridgeManager {
  /* Singleton */
  static get() {
    if (this.instance == null) {

      // LOG THAT WE ARE INSTANCIATING ANOTHER BRIDGE MANAGER                Ø
      log('! New BridgeManager()')                                        // Ø
      //                                                                     Ø

      this.instance = new BridgeManager()
    }
    return this.instance
  }

  constructor() {
    // Create the BridgeManager
    this.updateObservers = []
    this.note = initialNote
    this.initiateBridge()
  }

  // Add an observer (really a callback function)
  // for every time an update is made
  addUpdateObserver(callback) {
    let observer = { callback: callback }
    this.updateObservers.push(observer)
    return observer
  }

  // Trigger every callback as defined by the updateObservers
  notifyObserversOfUpdate() {
    for (var observer of this.updateObservers) {
      observer.callback()
    }
  }

  getNote() {
    return this.note
  }

  saveNote(newString) {
    let note = this.note
    note.content.text = newString

    // log('Saving from old: ', note, ' to new: ', newString)

    this.componentManager.saveItemWithPresave(note, () => {
      note.content.text = newString
    }, () => {})
  }

  initiateBridge() {
    var permissions = [
      {
        name: 'stream-context-item'
        // name: "stream-items"
      }
    ]

    this.componentManager = new ComponentManager(permissions, function() {
      // on ready
    })

    this.componentManager.streamContextItem(item => {

      // LOG THAT STREAM CONTEXT ITEM HAS BEEN CALLED                       Ø
      log(                                                               // Ø
        '! streamContextItem Callback called\n',                         // Ø
        ` this.note ${timestampString(this.note.updated_at)}\n`,         // Ø
        ` item upd@ ${timestampString(item.updated_at)}\n`,              // Ø
        ` right_now ${timestampString()}`,                               // Ø
      )                                                                  // Ø
      //                                                                    Ø

      this.note = item
      this.notifyObserversOfUpdate()
    })

    this.componentManager.streamItems(
      ['SN|Component', 'SN|Theme', 'SF|Extension'],
      items => {
        this.items = items.filter(item => {
          return !item.isMetadataUpdate
        })
      }
    )
  }
}

