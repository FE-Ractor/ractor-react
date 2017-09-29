import * as React from "react"
import { render } from "react-dom"
import Todo from "./views/todo"
import { Provider } from "ractor-react"
import { TodoStore } from "./stores/todo.store"

render(
  <Provider stores={[TodoStore]}>
    {React.createElement(Todo)}
  </Provider>,
  document.getElementById("app")
)