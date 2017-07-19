/* global process */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import configure from '../webpack.config';

const appConfig = {
    youtubeKey: process.env.YOUTUBE_API_KEY,
};

const config = configure({ appConfig });

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    stats: {
        colors: true,
    },
}));

app.use((req, res) => {

    req.url = '/spa.html';

    app(req, res);

});

export default app;
