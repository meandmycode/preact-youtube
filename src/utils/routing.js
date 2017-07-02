import { parse } from './uri-utils';

export const getVideoUrl = video => `/v/${video.contentDetails.videoId}`;

export const getPlaylistUrl = playlist => `/p/${playlist.playlistId}`;

export const createReferrerUrl = (url, referrer) => url + '?rv=' + referrer;

export const getResourceType = uri => {

    const { pathname } = parse(uri);

    if (pathname.startsWith('/p/')) return 'playlist';
    if (pathname.startsWith('/v/')) return 'video';

};

export const getReferrer = uri => {

    const { query } = parse(uri);

    if (query.rv == null) return;

    const type = getResourceType(query.rv);

    if (type == null) return;

    return {
        type,
        url: query.rv,
    };

};
