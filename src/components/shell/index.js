import { h, Component } from 'preact';
import Match from 'preact-router/match';

import { getReferrer } from '../../utils/routing';

import styles from './style.css';
import icon from './icon.png';

class Header extends Component {

    matchHandler = ({ url }) => {

        const referrer = getReferrer(url);

        return (referrer
            ? <a class={styles.back} part='backlink' href={referrer.url}>Back to {referrer.type}</a>
            : <a class={styles.home} part='homelink' href='/' style={`background-image: url(${icon})`} title='PreactTube' />
        );

    }

    render({ busy }) {

        return (
            <div class={styles.header} busy={busy ? '' : undefined}>
                <nav class={styles.nav}>
                    <Match>{this.matchHandler}</Match>
                </nav>
            </div>
        );
    }

}

export default ({ busy, children, ...props }) => (
    <div component='shell' class={styles.host} {...props}>
        <Header busy={busy} />
        <main class={styles.content}>
            {children}
        </main>
    </div>
);
