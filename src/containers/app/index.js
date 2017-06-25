import { h, options, Component } from 'preact';
import { Router } from 'preact-router';

import { CachingYoutubeService } from '../../services/youtube';

import Shell from '../../components/shell';
import Playlist from '../playlist';
import Video from '../video';

options.syncComponentUpdates = false;

const youtubeService = new CachingYoutubeService('__API_KEY_HERE__');

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
                    <Playlist path="/p/:playlistId" youtubeService={youtubeService} onProgress={this.handleProgress} />
                    <Video path="/v/:videoId" youtubeService={youtubeService} onProgress={this.handleProgress} />
                </Router>
            </Shell>
        );
    }

}
