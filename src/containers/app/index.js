import { h, Component } from 'preact';

import { CachingYoutubeService } from '../../services/youtube';

import Router from '../../components/router';
import Shell from '../../components/shell';
import Playlist from '../playlist';
import Video from '../video';

const youtubeService = new CachingYoutubeService(YOUTUBE_API_KEY); // eslint-disable-line no-undef
const defaultPlaylistId = 'PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ';

export default class App extends Component {

    progressions = new Map();

    state = {
        busy: false,
    }

    handleProgress = e => {

        // devnote: ideally here we would use progress details to show
        // the actual loaded amount progress, however there are bugs
        // across various browsers where the loading size cannot be
        // established due to various reasons (such as content encoding)

        if (e.type === 'loadend') this.progressions.delete(e.target);
        else this.progressions.set(e.target, e.type);

        const busy = this.progressions.size > 0;

        this.setState({ busy });

    }

    render(_, { busy }) {

        return (
            <Shell busy={busy}>
                <Router>
                    <Playlist path='/p/:playlistId' youtubeService={youtubeService} onProgress={this.handleProgress} />
                    <Video path='/v/:videoId' youtubeService={youtubeService} onProgress={this.handleProgress} />
                    <Playlist path='/baby-legs'  youtubeService={youtubeService} onProgress={this.handleProgress} playlistId='PLNu47mcqeyiATtjW5pIRWlpXBu4pUezdP' />
                    <Playlist default youtubeService={youtubeService} onProgress={this.handleProgress} playlistId={defaultPlaylistId} />
                </Router>
            </Shell>
        );
    }

}
