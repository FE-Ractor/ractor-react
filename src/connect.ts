import * as React from "react"
import { ActorRef } from "js-actor"
import { Store, system, Subscription } from "ractor"
import shallowEqual = require("shallowequal")
import { Context, contextType } from "./Provider"

export function connect<S extends object>(storeClass: new () => Store<S>, selector?: (state: S) => Partial<S>) {
	return function <P>(component: React.ComponentClass<P>): any {
		return class ConnectedComponent extends React.Component<P, S> {
			private store: Store<S>
			private subscription: Subscription
			private actor: ActorRef

			constructor(props: P) {
				super(props)
				this.store = new storeClass
				// 初始化默认值
				this.state = this.store.state
			}

			public componentWillUnmount() {
				this.actor.getContext().stop()
				this.subscription.unsubscribe()
			}

			public componentDidMount() {
				this.actor = system.actorOf(this.store, "__store__")
				this.subscription = this.store.subscribe(state => {
					if (selector) {
						const selectedState = selector(state) as S
						if (!shallowEqual(this.state, selectedState)) {
							this.setState(selectedState)
						}
					} else {
						if (!shallowEqual(this.state, state)) {
							this.setState(state)
						}
					}
				})
			}
			public render() {
				return React.createElement(component, Object.assign({}, this.props, this.state))
			}
		}
	}
}
