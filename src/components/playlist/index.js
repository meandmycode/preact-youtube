import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { shortDateFormatter } from '../../utils/formatting';
import { getVideoUrl, getPlaylistUrl, createReferrerUrl } from '../../utils/routing';

import MediaQuery from '../media-query';
import StreamingList, { StaticList } from '../streaming-list';
import RichText from '../rich-text';

import styles from './style.css';

const getItemUrl = (playlist, video) => createReferrerUrl(getVideoUrl(video), getPlaylistUrl(playlist));

export const PlaylistItem = ({ video, playlist, mobile }) => (
    <div class={styles.item} mobile={mobile ? '' : null} component='video'>
        <div class={styles.details}>
            <Link class={styles.title} part='title' href={getItemUrl(playlist, video)}>{video.snippet.title}</Link>
            <div class={styles.published} part='published'>Published on {shortDateFormatter.format(video.snippet.publishedAt)}</div>
            <RichText class={styles.description} part='description' text={video.snippet.description} />
        </div>
        <Link class={styles.thumbnail}
            part='thumbnail'
            title={video.snippet.title}
            href={getItemUrl(playlist, video)}
            src={video.snippet.thumbnails ? video.snippet.thumbnails.medium.url : undefined}
            style={video.snippet.thumbnails ? `background-image: url(${video.snippet.thumbnails.medium.url})` : undefined}
        />
    </div>
);

class Playlist extends Component {

    update({ playlist, matches }) {

        const itemTemplate = video => <PlaylistItem video={video} playlist={playlist} mobile={matches} />;

        const itemHeight = matches ? 300 : 198;

        this.setState({ itemTemplate, itemHeight });

    }

    componentWillMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.playlist === this.props.playlist && nextProps.matches === this.props.matches) return;
        this.update(nextProps);
    }

    shouldComponentUpdate({ position }, { itemTemplate, itemHeight }) {

        const shouldUpdate =
            this.props.position !== position ||
            this.state.itemTemplate !== itemTemplate ||
            this.state.itemHeight !== itemHeight;

        return shouldUpdate;
    }

    render({ playlist, position, onPositionChange }, { itemTemplate, itemHeight }) {

        const isSync = Array.isArray(playlist.items);
        const List = isSync ? StaticList : StreamingList;

        return (
            <div class={styles.playlist} component='playlist'>
                <List
                    part='items'
                    source={playlist.items}
                    total={playlist.total}
                    position={position}
                    itemTemplate={itemTemplate}
                    itemHeight={itemHeight}
                    itemGutter={20}
                    onPositionChange={onPositionChange}
                />
            </div>
        );
    }
}

export default props => (
    <MediaQuery query='(max-device-width: 480px)'>
        <Playlist {...props} />
    </MediaQuery>
);
