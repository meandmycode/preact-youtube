/* eslint-disable no-console, import/no-extraneous-dependencies */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import configure from '../webpack.config';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 9001;

const config = configure();

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    stats: {
        colors: true,
    },
}));

app.use((req, res, next) => {

    if (req.path === '/') return next();

    req.url = '/';

    app(req, res);

});

app.listen(port, host, err => {

    if (err) {
        return console.log(err);
    }

    console.log(`🚀  Web application is now running at http://${host}:${port}`);
    console.log('');

});
