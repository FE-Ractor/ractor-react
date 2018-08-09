import * as React from "react"
import { ActorRef } from "js-actor"
import { Store, Subscription } from "ractor"
import shallowEqual from "./shallowPartialEqual"
import { Context, contextType } from "./contextType"

export type Provider<T> = new (...args: any[]) => Store<T>

export function Providers<T1, T2, T3, T4, T5, T6>(providers: [Provider<T1>, Provider<T2>, Provider<T3>, Provider<T4>, Provider<T5>, Provider<T6>], selector?: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers<T1, T2, T3, T4, T5>(providers: [Provider<T1>, Provider<T2>, Provider<T3>, Provider<T4>, Provider<T5>], selector?: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers<T1, T2, T3, T4>(providers: [Provider<T1>, Provider<T2>, Provider<T3>, Provider<T4>], selector?: (t1: T1, t2: T2, t3: T3, t4: T4) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers<T1, T2, T3>(providers: [Provider<T1>, Provider<T2>, Provider<T3>], selector?: (t1: T1, t2: T2, t3: T3) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers<T1, T2>(providers: [Provider<T1>, Provider<T2>], selector?: (t1: T1, t2: T2) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers<T1>(providers: [Provider<T1>], selector?: (t1: T1) => object): <P>(component: React.ComponentClass<P>) => any
export function Providers(providers: Provider<any>[], selector?: (...args: any[]) => object) {
	return function <P>(component: React.ComponentClass<P>): any {
		return class ConnectedComponent<S extends { [key: string]: object }> extends React.Component<P, S> {
			static contextTypes = contextType
			private actorRef?: ActorRef
			private stores: Store<object>[] = []
			private subscriptions: Subscription[] = []
			private hasStoreMounted = false
			public context!: Context
			public state = {} as S

			constructor(props: P, context: Context) {
				super(props, context)
				this.getStoreFromContext(context, providers)
			}

			private getStoreFromContext(context: Context, providers: Provider<any>[]) {
				const contextStores = this.context.stores
				const restOfProviders: Provider<any>[] = []
				if (contextStores) {
					providers.forEach(provider => {
						for (let contextStore of contextStores) {
							if (contextStore instanceof provider) {
								Object.assign(this.state, contextStore.state)
								return this.stores.push(contextStore)
							}
						}
						restOfProviders.push(provider)
					})
					if (restOfProviders.length > 0) {
						if (context.parent) {
							this.getStoreFromContext(context.parent, restOfProviders)
						} else {
							throw TypeError(`Could not find the instance of ${providers[0].name}. pass it as the props to <Provider>`)
						}
					}
				} else {
					throw TypeError("Could not find store in the context, Please wrap your root component in the <Provider>.")
				}
			}

			public componentWillUnmount() {
				this.subscriptions.forEach(subscription => subscription.unsubscribe())
			}

			public componentDidMount() {
				this.stores.forEach(store => {
					const subscription = store.subscribe(state => {
						if (selector) {
							const arrState = this.stores.map(store => store.state)
							const selectedState = selector(...arrState)
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
