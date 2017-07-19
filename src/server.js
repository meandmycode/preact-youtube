/* global process */
import './css-hook';
import 'regenerator-runtime/runtime';
import fs from 'fs';
import minimist from 'minimist';
import request from 'request';
import express from 'express';
import shrinkRay from 'shrink-ray';
import render from 'preact-render-to-string';
import { h } from 'preact';

import NodeHttpGetter from './services/node-http-getter';
import YoutubeService from './services/youtube';

import Shell from './components/shell';
import Playlist from './components/playlist';
import Video from './components/video';

const args = minimist(process.argv.slice(2));
const env = process.env;

const hostHtml = fs.readFileSync('dist/client/spa.html');
const insertPosition = hostHtml.indexOf('</body>');

const host = args.host || env.HOST || '0.0.0.0';
const port = args.port || env.PORT || 9001;
const proxyHost = args.proxyHost || env.PROXY_HOST;
const proxyPort = args.proxyPort || env.PROXY_PORT;
const allowInsecureTls = args.allowInsecureTls;

const youtubeApiKey = env.YOUTUBE_API_KEY;

const wrap = fn => async (req, res, next) => {
    try {
        await fn(req, res);
    } catch (err) {
        next(err);
    }
};

const view = (res, component) => {

    const componentHtml = render(<Shell>{component}</Shell>);

    const html =
        hostHtml.slice(0, insertPosition) +
        componentHtml +
        hostHtml.slice(insertPosition);

    res.end(html);

};

// !! WARNING: this should only be used outside of production, specifically used for e2e sandbox testing
if (allowInsecureTls) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getter = new NodeHttpGetter(proxyHost && proxyPort ? request.defaults({ proxy: `http://${proxyHost}:${proxyPort}` }) : request);

const youtubeService = new YoutubeService(getter, youtubeApiKey);

const getPlaylist = async playlistId => {

    const playlist = await youtubeService.getPlaylist(playlistId, {
        maxResults: 10,
        part: 'snippet,contentDetails',
    });

    const total = playlist.pageInfo.totalResults;
    const items = playlist.items;

    const source = { playlistId, items, total };

    return <Playlist playlist={source} />;

};

const app = express();

app.use(shrinkRay());

app.get('/p/:playlistId', wrap(async (req, res) => {

    const playlist = await getPlaylist(req.params.playlistId);

    view(res, playlist);

}));

app.get('/v/:videoId', wrap(async (req, res) => {

    const videoId = req.params.videoId;

    const video = await youtubeService.getVideoItem(videoId, {
        part: 'snippet,contentDetails',
    });

    view(res, <Video video={video} />);

}));

app.get('/baby-legs', wrap(async (req, res) => {

    const playlist = await getPlaylist('PLNu47mcqeyiATtjW5pIRWlpXBu4pUezdP');

    view(res, playlist);

}));

app.get('/', wrap(async (req, res) => {

    const playlist = await getPlaylist('PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ');

    view(res, playlist);

}));

app.use(express.static('dist/client'));

app.listen(port, host, err => {

    if (err) {
        return console.log(err);
    }

});
