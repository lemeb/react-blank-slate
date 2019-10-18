import ComponentManager from "./componentManager.js";
import { initialNote } from "../lib/utils";

// const log = (...arg) => { if (lEnab) { console.log(...arg) } }, lEnab = true

export default class BridgeManager {
  /* Singleton */
  static get() {
    if (this.instance == null) {
      this.instance = new BridgeManager();
    }
    return this.instance;
  }

  constructor() {
    // Create the BridgeManager
    this.updateObservers = [];
    this.note = initialNote;
    this.initiateBridge();
  }

  // Add an observer (really a callback function)
  // for every time an update is made
  addUpdateObserver(callback) {
    let observer = { callback: callback };
    this.updateObservers.push(observer);
    return observer;
  }

  // Trigger every callback as defined by the updateObservers
  notifyObserversOfUpdate() {
    for (var observer of this.updateObservers) {
      observer.callback();
    }
  }

  getNote() {
    return this.note;
  }

  saveNote(newString) {
    let note = this.note;
    note.content.text = newString;

    this.componentManager.saveItemWithPresave(note, () => {
      note.content.text = newString;
    });
  }

  initiateBridge() {
    var permissions = [{ name: "stream-context-item" }];

    // Put in the function for when on_ready
    this.componentManager = new ComponentManager(permissions, function() {});

    this.componentManager.streamContextItem(item => {
      this.note = item;
      this.notifyObserversOfUpdate();
    });

    this.componentManager.streamItems(
      ["SN|Component", "SN|Theme", "SF|Extension"],
      items => {
        this.items = items.filter(item => {
          return !item.isMetadataUpdate;
        });
      }
    );
  }
}
