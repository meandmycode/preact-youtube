import { joinPaths } from '../utils/uri-utils';
import { serialize } from '../utils/query-string';
import JsonNormalizingVisitor from '../utils/json-normalizing-visitor';

const normalizer = new JsonNormalizingVisitor();

export const defaultBaseUri = 'https://www.googleapis.com/youtube/v3';

export default class YoutubeService {

    constructor(getter, key, baseUri = defaultBaseUri) {
        this.getter = getter;
        this.baseUri = baseUri;
        this.baseParameters = { key };
    }

    getUri(path, parameters) {
        return joinPaths(this.baseUri, path) + serialize({ ...this.baseParameters, ...parameters });
    }

    async getResource(path, parameters, options) {

        const uri = this.getUri(path, parameters);
        const json = await this.getter.get(uri, options);

        return normalizer.visit(json);

    }

    getPlaylist(playlistId, parameters, options) {
        return this.getResource('/playlistItems', { ...parameters, playlistId }, options);
    }

    async *getPlaylistItemsIterator(page, pager) {

        for (const item of page.items) yield item;

        if (page.nextPageToken) {

            const nextPage = await pager(page.nextPageToken);
            const subItems = this.getPlaylistItemsIterator(nextPage, pager);

            // https://github.com/babel/babel-eslint/issues/415
            // eslint-disable-next-line semi
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
