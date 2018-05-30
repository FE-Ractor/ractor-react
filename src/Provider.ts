import * as React from "react"
import { System, Store } from "ractor"
import { Context, contextType } from "./contextType"

export type Props = {
  system: System,
  stores?: Array<new (...args: any[]) => Store<any>>
}

export class Provider extends React.Component<Props> {
  static childContextTypes = contextType
  private stores: Store<any>[] = []
  constructor(props: Props, context: Context) {
    super(props, context)
    const { stores = [], system } = this.props
    // provider 的主要职责： 把 store 注册到 system 中
    for (let store of stores) {
      const actor = new store
      system.actorOf(actor)
      this.stores.push(actor)
    }
  }

  public getChildContext() {
    return { system: this.props.system, stores: this.stores }
  }

  public render() {
    return React.Children.only(this.props.children)
  }
}