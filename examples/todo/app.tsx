import * as React from "react"
import { render } from "react-dom"
import { system } from "./system/todo-system"
import Todo from "./views/todo"
import { Provider } from "../../src/Provider"
import { TodoStore } from "./stores/todo.store"

render(
  <Provider system={system} stores={[TodoStore]}>
    {React.createElement(Todo)}
  </Provider>,
  document.getElementById("app")
)