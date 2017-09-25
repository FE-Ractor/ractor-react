import * as React from "react";
import { system } from "../system";
export function Component(store) {
    return function (component) {
        return class ConnectedComponent extends React.Component {
            constructor() {
                super();
                this.actor = new store();
                this.state = this.actor.state;
                this.actor.setState = (state, callback) => {
                    this.actor.state = Object.assign(this.actor.state, state);
                    this.setState(state, callback);
                };
            }
            componentWillUnmount() {
                system.stop(this.actorRef);
            }
            componentDidMount() {
                this.actorRef = system.actorOf(this.actor, "__store__");
            }
            render() {
                return React.createElement(component, Object.assign({}, this.props, this.state));
            }
        };
    };
}
