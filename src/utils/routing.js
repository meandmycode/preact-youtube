import { parse } from './uri-utils';

export const getVideoUrl = video => `/v/${video.contentDetails.videoId}`;

export const getPlaylistUrl = playlist => `/p/${playlist.playlistId}`;

export const createReferrerUrl = (url, referrer) => url + '?rv=' + referrer;

export const getResourceType = uri => {

    const { pathname } = parse(uri);

    if (/^\/p\//.test(pathname)) return 'playlist';
    else if (/^\/v\//.test(pathname)) return 'video';

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
