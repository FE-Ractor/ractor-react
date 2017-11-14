import * as React from "react"
import { system } from "../../system/todo-system"
import { Todo } from "../../types/todo"
import { AddTodo } from "../../messages/AddTodo"

export const Header = () =>
	<header className="header">
		<h1>todos</h1>
		<input className="new-todo" onKeyDown={onkeydown} placeholder="What needs to be done?" autoFocus={true} />
	</header>

const onkeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
	const value = event.currentTarget.value
	if (value === "") return
	if (event.keyCode === 13) {
		system.dispatch(new AddTodo({ status: "active", value }))
	}
}