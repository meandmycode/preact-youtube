import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { shortDateFormatter } from '../../utils/formatting';
import { getVideoUrl, getPlaylistUrl, createReferrerUrl } from '../../utils/routing';

import MediaQuery from '../media-query';
import StreamingList from '../streaming-list';
import RichText from '../rich-text';

import styles from './style.css';

const getItemUrl = (playlist, video) => createReferrerUrl(getVideoUrl(video), getPlaylistUrl(playlist));
const getVideoThumbnail = (video, matches) => video.snippet.thumbnails ? video.snippet.thumbnails[matches ? 'medium' : 'high'].url : null;

class Playlist extends Component {

    update({ playlist, matches }) {

        const itemTemplate = video => (
            <div class={styles.item} mobile={matches ? '' : null} component='video'>
                <div class={styles.details}>
                    <Link class={styles.title} part='title' href={getItemUrl(playlist, video)}>{video.snippet.title}</Link>
                    <div class={styles.published} part='published'>Published on {shortDateFormatter.format(video.snippet.publishedAt)}</div>
                    <RichText class={styles.description} part='description' text={video.snippet.description} />
                </div>
                <Link class={styles.thumbnail}
                    part='thumbnail'
                    title={video.snippet.title}
                    href={getItemUrl(playlist, video)}
                    style={`background-image: url(${getVideoThumbnail(video, matches)})`}
                />
            </div>
        );

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

    shouldComponentUpdate = ({ position }, { itemTemplate, itemHeight }) =>
        this.props.position !== position ||
        this.state.itemTemplate !== itemTemplate ||
        this.state.itemHeight !== itemHeight;

    render = ({ playlist, position, onPositionChange }, { itemTemplate, itemHeight }) => (
        <div class={styles.playlist} component='playlist'>
            <StreamingList
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

export default props => (
    <MediaQuery query='(max-device-width: 480px)'>
        <Playlist {...props} />
    </MediaQuery>
);
