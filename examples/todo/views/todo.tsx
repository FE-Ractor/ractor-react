import * as React from "react"
import { system } from "../system/todo-system"
import { Providers } from "../../../src/Providers"
import { Header } from "./header/header"
import { List } from "./list/list"
import { Control } from "./control/control"
import { TodoStore, TodoState } from "../stores/todo.store"
import { InitTodos } from "../messages/InitTodos"

@Providers([TodoStore], todoState => ({ display: todoState.display, todos: todoState.todos }))
export default class TodoComponent extends React.Component<TodoState, {}> {
	public componentDidMount() {
		system.dispatch(new InitTodos)
	}
	public render() {
		return (
			<section className="todoapp">
				<Header />
				<List todos={this.props.todos} display={this.props.display} />
				<Control display={this.props.display} todos={this.props.todos} />
			</section>
		)
	}
}
