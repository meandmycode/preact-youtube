import { h } from 'preact';

import { shortDateFormatter } from '../../utils/formatting';

import RichText from '../rich-text';

import styles from './style.css';

const getEmbedUri = video => `https://www.youtube.com/embed/${video.id}`;

export default ({ video }) => (
    <div class={styles.container} component='video'>
        <div class={styles.details}>
            <div class={styles.title} part='title'>{video.snippet.title}</div>
            <div class={styles.published} part='published'>Published on {shortDateFormatter.format(video.snippet.publishedAt)}</div>
            <RichText class={styles.description} part='description' text={video.snippet.description} />
        </div>
        <div class={styles.media}>
            <iframe class={styles.video} part='embed' src={getEmbedUri(video)} />
        </div>
    </div>
);
