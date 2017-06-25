import { h } from 'preact';

import RichText from '../rich-text';

import './style.css';

const formatDate = date => date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const getEmbedUri = video => `https://www.youtube.com/embed/${video.id}`;

export default ({ video }) => (
    <div styleName='container'>
        <div styleName='details-wrapper'>
            <div styleName='details'>
                <div styleName='title' href={`/v/${video.id}?rv=`}>{video.snippet.title}</div>
                <div styleName='published'>Published on {formatDate(video.snippet.publishedAt)}</div>
                <RichText styleName='description' text={video.snippet.description} />
            </div>
        </div>
        <div styleName='media'>
            <iframe styleName='video' src={getEmbedUri(video)} />
        </div>
    </div>
);
