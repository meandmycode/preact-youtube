import { h, Component } from 'preact';

import Cancellation from '../../utils/cancellation';
import Playlist from '../../components/playlist';

export default class PlaylistView extends Component {

    async updatePlaylist({ youtubeService, playlistId, onProgress }) {

        const progress = onProgress;
        const [cancellation, cancellor] = Cancellation.create();

        const [videos] = await youtubeService.getPlaylistItems(playlistId, {
            maxResults: 50,
            part: 'snippet,contentDetails',
        }, {
            progress,
            cancellation,
        });

        this.setState({ videos, cancellor });

    }

    componentWillMount() {
        this.updatePlaylist(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.playlistId === this.props.playlistId) return;
        this.updatePlaylist(newProps);
    }

    componentWillUnmount() {

        const { cancellor } = this.state;

        if (cancellor) cancellor();

    }

    render(_, { videos }) {
        return <Playlist videos={videos} />;
    }

}
