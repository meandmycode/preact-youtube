import { h, Component } from 'preact';
import Match from 'preact-router/match';

import { getReferrer } from '../../utils/routing';

import './style.css';

class Header extends Component {

    matchHandler = ({ url }) => {

        const referrer = getReferrer(url);

        return (referrer
            ? <a styleName='back' part='backlink' href={referrer.url}>Back to {referrer.type}</a>
            : <a styleName='home' part='homelink' href='/'>YouTube playlist</a>
        );

    }

    render({ busy }) {

        return (
            <div styleName='header'>
                <nav styleName='nav'>
                    <Match>{this.matchHandler}</Match>
                </nav>
                <div styleName='knight-rider' hidden={!busy} />
            </div>
        );
    }

}

export default ({ busy, children, ...props }) => (
    <div component='shell' styleName='host' {...props}>
        <Header busy={busy} />
        <div styleName='content'>
            {children}
        </div>
    </div>
);
