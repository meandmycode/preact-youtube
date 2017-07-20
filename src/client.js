import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es7/symbol';
import 'regenerator-runtime/runtime';
import { h, Component, render } from 'preact';
import { register } from 'serviceworker-webpack-plugin/lib/runtime';

import XhrHttpGetter from './services/xhr-http-getter';
import { CachingYoutubeService } from './services/youtube';

import Router from './components/router';
import Shell from './components/shell';
import Playlist from './containers/playlist';
import Video from './containers/video';

const youtubeService = new CachingYoutubeService(new XhrHttpGetter(), YOUTUBE_API_KEY); // eslint-disable-line no-undef
const defaultPlaylistId = 'LLKtLy-jPPl11MLGLgkRwQGQ';

class App extends Component {

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
                    <Playlist default youtubeService={youtubeService} onProgress={this.handleProgress} playlistId={defaultPlaylistId} />
                </Router>
            </Shell>
        );
    }

}

if ('serviceWorker' in navigator) {
    register();
}

render(<App />, document.body, document.querySelector('div'));
