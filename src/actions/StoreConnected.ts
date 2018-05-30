import { Store } from "ractor"

export class StoreConnected {
  constructor(public store: Store<any>) { }
}