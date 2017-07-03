import { h } from 'preact';

import { shortDateFormatter } from '../../utils/formatting';

import RichText from '../rich-text';

import styles from './style.css';

const getEmbedUri = video => `https://www.youtube.com/embed/${video.id}`;

export default ({ video }) => (
    <div class={styles.container}>
        <div class={styles.details}>
            <div class={styles.title} href={`/v/${video.id}?rv=`}>{video.snippet.title}</div>
            <div class={styles.published}>Published on {shortDateFormatter.format(video.snippet.publishedAt)}</div>
            <RichText class={styles.description} text={video.snippet.description} />
        </div>
        <div class={styles.media}>
            <iframe class={styles.video} src={getEmbedUri(video)} />
        </div>
    </div>
);
