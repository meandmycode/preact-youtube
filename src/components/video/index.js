import { h } from 'preact';

import { shortDateFormatter } from '../../utils/formatting';

import RichText from '../rich-text';

import './style.css';

const getEmbedUri = video => `https://www.youtube.com/embed/${video.id}`;

export default ({ video }) => (
    <div styleName='container'>
        <div styleName='details-wrapper'>
            <div styleName='details'>
                <div styleName='title' href={`/v/${video.id}?rv=`}>{video.snippet.title}</div>
                <div styleName='published'>Published on {shortDateFormatter.format(video.snippet.publishedAt)}</div>
                <RichText styleName='description' text={video.snippet.description} />
            </div>
        </div>
        <div styleName='media'>
            <iframe styleName='video' src={getEmbedUri(video)} />
        </div>
    </div>
);
