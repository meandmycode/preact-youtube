import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import configure from '../webpack.config';

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

export default app;
