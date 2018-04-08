import * as React from "react"
import { Todo } from "../../types/todo"
import { system } from "../../system/todo-system"
import { ToggleToto } from "../../messages/ToggleTodo"
import { DestroyTodo } from "../../messages/DestroyTodo"

export class List extends React.Component<{ todos: Array<Todo>, display: string }, {}> {
	public render() {
		const items = this.props.todos
			.filter(todo => this.props.display === "all" ? true : todo.status === this.props.display)
			.map((todo, index) => (
				<li className={todo.status} key={index}>
					<div className="view">
						<input className="toggle" type="checkbox" onChange={this.toggle(todo)} checked={todo.status === "completed" ? true : false} />
						<label>{todo.value}</label>
						<button className="destroy" onClick={this.destroy(index)}></button>
					</div>
				</li>
			))
		return (
			<section className="main">
				<input className="toggle-all" type="checkbox" />
				<label htmlFor="toggle-all">Mark all as complete</label>
				<ul className="todo-list">
					{items}
				</ul>
			</section>
		)
	}

	private toggle = (todo: Todo) => () => {
		system.dispatch(new ToggleToto(todo))
	}

	private destroy = (index: number) => () => {
		system.dispatch(new DestroyTodo(index))
	}
}
