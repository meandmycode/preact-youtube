import { h, Component } from 'preact';

import './style.css';

const STATE_PENDING = 'pending';
const STATE_LOADED = 'loaded';
const STATE_ERROR = 'error';

export default class Image extends Component {

    state = {
        state: STATE_PENDING,
    }

    handleLoad = () => {
        this.setState({ state: STATE_LOADED });
    }

    handleError = () => {
        this.setState({ state: STATE_ERROR });
    }

    update({ src }) {

        const img = new window.Image();
        img.onload = this.handleLoad;
        img.onerror = this.handleError;
        img.src = src;

    }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.update(nextProps);
    }

    render({ ...props }, { state }) {

        return (
            <div styleName='container' {...props}>
                <div styleName='image' data-state={state} style={`background-image: url(${props.src})`} />
            </div>
        );
    }

}
