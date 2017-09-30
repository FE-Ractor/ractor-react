import * as React from "react"
import { system, Store } from "ractor"
const PropTypes = require("prop-types")

export type Props = {
  stores: [new () => Store<any>]
}

export type Context = { stores: Store<any>[] }

export const contextType = {
  stores: PropTypes.array
}

export class Provider extends React.Component<Props> {
  static childContextTypes: Context = contextType
  private stores: Store<any>[] = []
  constructor(props: Props, context: Context) {
    super(props, context)
    const stores = this.props.stores
    // provider 的主要职责： 把 store 注册到 system 中
    for (let store of stores) {
      const actor = new store
      system.actorOf(actor, "__store__")
      this.stores.push(actor)
    }
  }

  public getChildContext() {
    return { stores: this.stores }
  }

  public render() {
    return React.Children.only(this.props.children)
  }
}