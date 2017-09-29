import * as React from "react"
import { render } from "react-dom"
import { Provider } from "../../src/Provider"
import { Counter } from "./container/Counter"
import { CounterStore } from "./stores/CounterStore"

render(React.createElement(Counter), document.getElementById("root"))