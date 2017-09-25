import * as React from "react";
import { system } from "../system";
import { StoreActor } from "../StoreActor";
import { shallowEqual } from "../shallowEqual";
export function connect({ state = {}, behavior }) {
    return function (component) {
        return class ConnectComponent extends React.Component {
            constructor() {
                super(...arguments);
                this.listener = () => {
                    if (!shallowEqual(this.actor.state, this.state)) {
                        this.setState(this.actor.state);
                    }
                };
                this.state = state;
            }
            componentWillUnmount() {
                system.stop(this.actorRef);
                system.eventStream.removeListener("message", this.listener);
            }
            componentDidMount() {
                this.actor = new StoreActor(Object.assign({}, this.state), behavior);
                this.actorRef = system.actorOf(this.actor, "message");
                system.eventStream.addListener("message", this.listener);
            }
            render() {
                return React.createElement(component, Object.assign({}, this.props, this.state));
            }
        };
    };
}
