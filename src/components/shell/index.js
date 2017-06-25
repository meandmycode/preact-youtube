import { h } from 'preact';

import './style.css';

export default ({ busy, children, ...props }) => (
    <div styleName='host' {...props}>
        <div styleName='header'>
            <nav styleName='nav'>
                Probably the best youtube app
            </nav>
            <div styleName='knight-rider' hidden={!busy} />
        </div>
        <div styleName='content'>
            {children}
        </div>
    </div>
);
