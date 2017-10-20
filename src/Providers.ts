import * as React from "react"
import { ActorRef } from "js-actor"
import { Store, system, Subscription } from "ractor"
import shallowEqual from "./shallowEqual"
import { Context, contextType } from "./Provider"

export type Provider = {
	provide: new () => Store<object>
	selector?: (state: any) => object
}
export function Providers(providers: Provider[]) {
	return function <P>(component: React.ComponentClass<P>): any {
		return class ConnectedComponent<S extends { [key: string]: object }> extends React.Component<P, S> {
			static contextTypes = contextType
			private actorRef?: ActorRef
			private stores: Array<{ instance: Store<object>, selector?: Provider["selector"] }> = []
			private subscriptions: Subscription[] = []
			private hasStoreMounted = false
			public context: Context
			public state = {} as S

			constructor(props: P, context: Context) {
				super(props, context)

				const contextStores = this.context.stores

				if (contextStores) {
					providers.forEach(provider => {
						for (let contextStore of contextStores) {
							if (contextStore instanceof provider.provide) {
								Object.assign(this.state, contextStore.state)
								return this.stores.push({ instance: contextStore, selector: provider.selector })
							}
						}
						throw TypeError(`Could not find the instance of ${provider.provide.name}. pass it as the props to <Provider>`)
					})
				} else {
					throw TypeError("Could not find store in the context, Please wrap your root component in the <Provider>.")
				}
			}

			public componentWillUnmount() {
				this.subscriptions.forEach(subscription => subscription.unsubscribe())
			}

			public componentDidMount() {
				this.stores.forEach(store => {
					const { instance, selector } = store
					const subscription = instance.subscribe(state => {
						if (selector) {
							const selectedState = selector(state)
							if (!shallowEqual(this.state, selectedState)) {
								this.setState(selectedState)
							}
						} else {
							if (!shallowEqual(this.state, state)) {
								this.setState(state)
							}
						}
					})
					this.subscriptions.push(subscription)
				})
			}

			public render() {
				return React.createElement(component, Object.assign({}, this.props, this.state))
			}
		}
	}
}
