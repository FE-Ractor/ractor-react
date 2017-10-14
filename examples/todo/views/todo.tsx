import * as React from "react"
import { dispatch, system } from "ractor"
import { Providers } from "../../../src/Providers"
import { Header } from "./header/header"
import { List } from "./list/list"
import { Control } from "./control/control"
import { TodoStore, TodoState } from "../stores/todo.store"
import { InitTodos } from "../messages/InitTodos"
import { Todo } from "../types/todo"

type Props = { store: TodoState }

@Providers([
	{ name: "store", provide: TodoStore }
])
export default class TodoComponent extends React.Component<Props, {}> {
	public componentDidMount() {
		dispatch(new InitTodos)
	}
	public render() {
		const store = this.props.store
		return (
			<section className="todoapp">
				<Header />
				<List todos={store.todos} display={store.display} />
				<Control display={store.display} todos={store.todos} />
			</section>
		)
	}
}
