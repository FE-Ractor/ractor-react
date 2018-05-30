import { System, Store } from "ractor"
const PropTypes = require("prop-types")

export type Context = { stores: Store<any>[], system: System }

export const contextType = {
  system: PropTypes.object,
  stores: PropTypes.array
}