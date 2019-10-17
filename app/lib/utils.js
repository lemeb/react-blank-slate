import { Value } from 'slate'
import initialValueAsJson from './value.json'

export const timestampString = (dateobj) => {
  if (!dateobj) { // gets dateobj of now if no arg passed
    dateobj = new Date() 
  }
  let ddmmyy = [ // returns a 'dd/mm/yy' string
    fillWithZeros(dateobj.getDate(), 2),
    fillWithZeros(dateobj.getMonth() + 1, 2), 
    fillWithZeros(dateobj.getFullYear() - 2000, 2)
  ].join('/')
  let hhmmssll = [ // -> 'hh:mm:ss:ll' with ll millisec
    fillWithZeros(dateobj.getHours(), 2),
    fillWithZeros(dateobj.getMinutes(), 2),
    fillWithZeros(dateobj.getSeconds(), 2),
    fillWithZeros(dateobj.getMilliseconds(), 3)
  ].join(':')
  return ['(dd/mm/yy)', ddmmyy, hhmmssll].join(' ')
}

// if millisecond string is '6', returns '006'
const fillWithZeros = (val, numbers) => {
  var v = String(val)
  var difflen = numbers - v.length
  return '0'.repeat(difflen) + v
}

// Constants that represent default values for
// the Value Object of SlateJS and a SN Note
export const initialValue = Value.fromJSON(initialValueAsJson)
export const initialNote = { content: { text: '' }, updated_at: new Date(), }
