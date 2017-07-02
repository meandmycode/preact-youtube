import { join } from '../../utils/uri-utils';
import { serialize } from '../../utils/query-string';
import JsonNormalizingVisitor from '../../utils/json-normalizing-visitor';

const normalizer = new JsonNormalizingVisitor();

const gettyget = (uri, { cancellation, progress } = {}) => new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', uri);

    xhr.onprogress = progress;
    xhr.onloadstart = progress;
    xhr.onloadend = progress;

    xhr.onerror = () => reject();


    xhr.onload = () => {

        if (cancellation.canceled) return reject();

        const json = JSON.parse(xhr.responseText);
        const normalized = normalizer.visit(json);

        resolve(normalized);

    };

    cancellation.addListener(() => xhr.abort());

    xhr.send();

});

export const defaultBaseUri = 'https://www.googleapis.com/youtube/v3';

export default class YoutubeService {

    constructor(key, baseUri = defaultBaseUri) {
        this.baseUri = baseUri;
        this.baseParameters = { key };
    }

    getUri(path, parameters) {
        return join(this.baseUri, path) + serialize({ ...this.baseParameters, ...parameters });
    }

    getResource(path, parameters, options) {

        const uri = this.getUri(path, parameters);
        return gettyget(uri, options);

    }

    getPlaylist(playlistId, parameters, options) {
        return this.getResource('/playlistItems', { ...parameters, playlistId }, options);
    }

    async *getPlaylistItemsIterator(page, pager) {

        for (const item of page.items) yield item;

        if (page.nextPageToken) {

            const nextPage = await pager(page.nextPageToken);
            const subItems = this.getPlaylistItemsIterator(nextPage, pager);

            for await (const item of subItems) yield item;

        }

    }

    async getPlaylistItems(playlistId, parameters, options) {

        const page = await this.getPlaylist(playlistId, parameters, options);

        const total = page.pageInfo.totalResults;

        // todo: progress should be rewritten for pagination
        const items = this.getPlaylistItemsIterator(page,
            pageToken => this.getPlaylist(playlistId, { ...parameters, pageToken }, options));

        const playlist = {
            playlistId,
            total,
            items,
        };

        return playlist;

    }

    async getVideoItem(videoId, parameters, options) {
        const { items } = await this.getResource('/videos', { ...parameters, id: videoId }, options);
        return items[0];
    }

}

export class CachingYoutubeService extends YoutubeService {

    playlists = Object.create(null);
    videos = Object.create(null);

    async getPlaylist(playlistId, parameters, options) {

        const playlistUri = this.getUri('/playlistItems', { ...parameters, playlistId });

        const cached = this.playlists[playlistUri];

        if (cached) return cached;

        const playlist = await super.getPlaylist(playlistId, parameters, options);

        this.playlists[playlistUri] = playlist;

        for (const item of playlist.items) {

            const videoUri = this.getUri('/videos', { part: parameters.part, id: item.contentDetails.videoId });

            this.videos[videoUri] = { ...item, id: item.contentDetails.videoId };

        }

        return playlist;

    }

    async getVideoItem(videoId, parameters, options) {

        const videoUri = this.getUri('/videos', { ...parameters, id: videoId });

        const cached = this.videos[videoUri];

        if (cached) return cached;

        const video = await super.getVideoItem(videoId, parameters, options);

        this.videos[videoUri] = video;

        return video;

    }

}
