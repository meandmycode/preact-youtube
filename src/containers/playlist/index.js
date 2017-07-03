import { h, Component } from 'preact';

import Cancellation from '../../utils/cancellation';
import Playlist from '../../components/playlist';

export default class PlaylistView extends Component {

    async updatePlaylist({ youtubeService, playlistId, onProgress }) {

        const progress = onProgress;
        const [cancellation, cancellor] = Cancellation.create();

        const playlist = await youtubeService.getPlaylistItems(playlistId, {
            maxResults: 50,
            part: 'snippet,contentDetails',
        }, {
            progress,
            cancellation,
        });

        this.setState({ playlist, cancellor });

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

    handlePositionChange = position => this.props.onRouteStateChange({ position })

    render({ routeState }, { playlist }) {

        if (playlist == null) return;

        return (
            <Playlist
                playlist={playlist}
                position={routeState && routeState.position}
                onPositionChange={this.handlePositionChange}
            />
        );
    }

}
