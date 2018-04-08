import * as React from "react"
import { ActorRef } from "js-actor"
import { Store, System, Subscription } from "ractor"
import shallowEqual from "./shallowEqual"
import { Context, contextType } from "./Provider"

export function Connect<S extends object>(storeClass: new () => Store<S>, selector?: (state: S) => object) {
	return function <P>(component: React.ComponentClass<P>): any {
		return class ConnectedComponent extends React.Component<P, S> {
			static contextTypes = contextType
			private store: Store<S>
			private subscription!: Subscription
			private actor!: ActorRef

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
				if (!this.context.system) {
					throw TypeError(`Could not find the instance of System. pass it as the props to <Provider>`)
				}
				this.actor = this.context.system.actorOf(this.store, "__store__")
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
