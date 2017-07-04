import { h, Component } from 'preact';
import Match from 'preact-router/match';

import { getReferrer } from '../../utils/routing';

import styles from './style.css';

class Header extends Component {

    matchHandler = ({ url }) => {

        const referrer = getReferrer(url);

        return (referrer
            ? <a class={styles.back} part='backlink' href={referrer.url}>Back to {referrer.type}</a>
            : <a class={styles.home} part='homelink' href='/'>YouTube playlist</a>
        );

    }

    render({ busy }) {

        return (
            <div class={styles.header}>
                <nav class={styles.nav}>
                    <Match>{this.matchHandler}</Match>
                </nav>
                <div class={styles.knightrider} hidden={!busy} />
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
