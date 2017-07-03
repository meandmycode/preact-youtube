import path from 'path';
import { defineSupportCode } from 'cucumber';

const ensureProxy = scenario => {

    const proxy = scenario.proxy || (scenario.proxy = scenario.createProxy());

    proxy.use((req, res, next) => {

        if (req.hostname === 'fake-static-domain') {
            res.sendFile(path.resolve(`features/data/${req.path}`));
        } else next();

    });

    return proxy;

};

defineSupportCode(({ Given, After }) => {

    Given('a youtube playlist {stringInDoubleQuotes} exists as {stringInDoubleQuotes} from the api', function(jsonPath, playlistId) {

        const proxy = ensureProxy(this);

        proxy.use((req, res, next) => {

            if (req.hostname === 'www.googleapis.com' &&
                req.path === '/youtube/v3/playlistItems' &&
                req.query.playlistId === playlistId) {

                res.append('Access-Control-Allow-Origin', '*');
                res.sendFile(path.resolve(`features/data/${jsonPath}`));

            } else next();

        });

    });

    Given('a youtube video {stringInDoubleQuotes} exists as {stringInDoubleQuotes} from the api', function(jsonPath, videoId) {

        const proxy = ensureProxy(this);

        proxy.use((req, res, next) => {

            if (req.hostname === 'www.googleapis.com' &&
                req.path === '/youtube/v3/videos' &&
                req.query.id === videoId) {

                res.append('Access-Control-Allow-Origin', '*');
                res.sendFile(path.resolve(`features/data/${jsonPath}`));

            } else next();

        });

    });

    After(async function() {

        const { proxy } = this;

        this.proxy = null;

        if (proxy) await proxy.quit();

    });

});
