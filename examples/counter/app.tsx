import * as React from "react"
import { render } from "react-dom"
import { Provider } from "ractor-react"
import { system } from "./system/counter-system"
import { Counter } from "./container/Counter"
import { CounterStore } from "./stores/CounterStore"


const App = () => <Provider system={system}>{React.createElement(Counter)}</Provider>

render(<App />, document.getElementById("root"))