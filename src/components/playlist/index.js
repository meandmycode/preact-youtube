import { h } from 'preact';
import { Link } from 'preact-router/match';

import StreamingList from '../streaming-list';
import RichText from '../rich-text';
import Image from '../image';

import './style.css';

const formatDate = date => date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const getPageSize = visibleItems => visibleItems * 4;

export const SummaryVideo = ({ video }) => (
    <div styleName='item'>
        <div styleName='details'>
            <Link styleName='title' href={`/v/${video.contentDetails.videoId}`}>{video.snippet.title}</Link>
            <div styleName='published'>Published on {formatDate(video.snippet.publishedAt)}</div>
            <RichText styleName='description' text={video.snippet.description} />
        </div>
        <Link styleName='thumbnail-link' href={`/v/${video.contentDetails.videoId}`}>
            <Image styleName='thumbnail' src={video.snippet.thumbnails ? video.snippet.thumbnails.medium.url : null} />
        </Link>
    </div>
);

const itemCreator = video => <SummaryVideo video={video} />;

export default ({ videos }) => (
    <StreamingList
        styleName='playlist'
        source={videos}
        pageSizer={getPageSize}
        itemTemplate={itemCreator}
        itemHeight={198}
        itemGutter={20}
    />
);
