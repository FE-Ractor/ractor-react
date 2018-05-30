import { Store } from "ractor"

export class StoreDisconnected {
  constructor(public store: Store<any>) { }
}