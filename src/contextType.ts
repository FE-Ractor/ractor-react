import { System, Store } from "ractor"
const PropTypes = require("prop-types")

export type Context = { parent: Context, stores: Store<any>[], system: System }

export const contextType = {
  parent: PropTypes.object,
  system: PropTypes.object,
  stores: PropTypes.array
}