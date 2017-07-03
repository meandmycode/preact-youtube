import { cloneElement } from 'preact';
import { Router } from 'preact-router';

export default class SwankyRouter extends Router {

    handleRouteStateChange = url => routeState => this.setState({ [url]: routeState })

    render(props, state) {

        const component = super.render(props, state);

        if (component == null) return component;

        const routeState = state[state.url];

        return cloneElement(component, { routeState, onRouteStateChange: this.handleRouteStateChange(state.url) });

    }
}
