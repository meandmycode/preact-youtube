import { cloneElement, Component } from 'preact';

export default class MediaProxy extends Component {

    listener;

    handleChange = ({ matches }) => this.setState({ matches });

    updateQuery(query) {

        if (this.listener) this.listener.removeListener(this.handleChange);

        const listener = matchMedia(query);
        listener.addListener(this.handleChange);

        this.handleChange(listener);

        this.listener = listener;

    }

    componentDidMount() {
        this.updateQuery(this.props.query);
    }

    componentWillReceiveProps({ query }) {
        if (query === this.props.query) return;
        this.updateQuery(query);
    }

    componentWillUnmount() {
        if (this.listener) this.listener.removeListener(this.handleChange);
    }

    render({ children }, { matches }) {
        return cloneElement(children[0], { matches });
    }
}
