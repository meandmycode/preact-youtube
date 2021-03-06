import { h, Component } from 'preact';

import Cancellation from '../../utils/cancellation';
import Video from '../../components/video';

export default class VideoView extends Component {

    async updateVideo({ youtubeService, videoId, onProgress }) {

        const progress = onProgress;
        const [cancellation, cancellor] = Cancellation.create();

        const video = await youtubeService.getVideoItem(videoId, {
            part: 'snippet,contentDetails',
        }, {
            progress,
            cancellation,
        });

        this.setState({ video, cancellor });

    }

    componentDidMount() {
        this.updateVideo(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.videoId === this.props.videoId) return;
        this.updateVideo(newProps);
    }

    componentWillUnmount() {

        const { cancellor } = this.state;

        if (cancellor) cancellor();

    }

    render(_, { video }) {
        return video ? <Video video={video} /> : null;
    }

}
