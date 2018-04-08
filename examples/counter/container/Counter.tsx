import * as React from "react"
import { Connect } from "../../../src/Connect"
import { CounterStore } from "../stores/CounterStore"
import { system } from "../system/counter-system"
import { Increment } from "../messages/Increment"
import { Decrement } from "../messages/Decrement"

@Connect(CounterStore)
export class Counter extends React.Component<{ value: number }> {
	public render() {
		return (
			<p>
				Clicked: {this.props.value} times
			{' '}
				<button onClick={() => system.dispatch(new Increment)}>
					+
			</button>
				{' '}
				<button onClick={() => system.dispatch(new Decrement)}>
					-
			</button>
				{' '}
				<button onClick={this.incrementIfOdd}>
					Increment if odd
			</button>
				{' '}
				<button onClick={this.incrementAsync}>
					Increment async
			</button>
			</p>
		)
	}

	public incrementIfOdd = () => {
		if (this.props.value % 2 === 1) {
			system.dispatch(new Increment)
		}
	}

	public incrementAsync = () => {
		setTimeout(() => system.dispatch(new Increment), 1000)
	}
}