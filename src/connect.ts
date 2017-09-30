import * as React from "react"
import { ActorRef } from "js-actor"
import { Store, system } from "ractor"
import { Context, contextType } from "./Provider"

export function connect<S extends object>(store: new () => Store<S>, selector?: (state: S) => Partial<S>) {
	return function <P>(component: React.ComponentClass<P>): any {
		return class ConnectedComponent extends React.PureComponent<P, S> {
			static contextTypes = contextType
			private actorRef?: ActorRef
			private storeActor: Store<S>
			private unsubscribe: () => void
			private hasStoreMounted = false
			public context: Context

			constructor(props: P, context: Context) {
				super(props, context)
				// 先去 context 找有没有这个 store，找到了就用已经存在的实例，找不到就实例化一个
				const stores = this.context.stores
				// 如果没 使用 Provider 组件，则 stores 不存在
				const storeActor = stores ? stores.find(storeInstance => storeInstance instanceof store) : null
				if (storeActor) {
					this.storeActor = storeActor
					this.hasStoreMounted = true
				} else {
					this.storeActor = new store
				}
				this.state = this.storeActor.state
			}

			public componentWillUnmount() {
				// 如果是动态注入的，则需要动态的移除
				if (!this.hasStoreMounted) {
					system.stop(this.actorRef!)
				}
				// 取消监听 store
				this.unsubscribe()
			}
			public componentDidMount() {
				// 为系统安装我们的 store
				if (!this.hasStoreMounted) {
					this.actorRef = system.actorOf(this.storeActor, "__store__")
				}
				// 订阅已经启动的 store，监听 store 的状态变化
				this.unsubscribe = this.storeActor.subscribe((state, callback) => {
					if (selector) {
						this.setState(selector(state) as S, callback)
					} else {
						this.setState(state, callback)
					}
				})
			}
			public render() {
				return React.createElement(component, Object.assign({}, this.props, this.state))
			}
		}
	}
}
