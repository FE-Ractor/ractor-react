import * as React from "react"
import { dispatch, system } from "ractor"
import { connect } from "ractor-react"
import { Header } from "./header/header"
import { List } from "./list/list"
import { Control } from "./control/control"
import { TodoStore, TodoState } from "../stores/todo.store"
import { InitTodos } from "../messages/InitTodos"
import { Todo } from "../types/todo"

@connect(TodoStore)
export default class TodoComponent extends React.Component<TodoState, {}> {
	public componentDidMount() {
		console.log(system)
		dispatch(new InitTodos)
	}
	public render() {
		return (
			<section className="todoapp">
				{Header(this.props.todos)}
				<List todos={this.props.todos} display={this.props.display} />
				<Control display={this.props.display} todos={this.props.todos} />
			</section>
		)
	}
}
