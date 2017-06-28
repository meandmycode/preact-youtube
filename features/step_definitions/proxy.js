import path from 'path';
import { defineSupportCode } from 'cucumber';

defineSupportCode(({ Given }) => {

    Given('a youtube playlist {stringInDoubleQuotes} exists as {stringInDoubleQuotes} from the api', function(jsonPath, playlistId) {

        const { proxyServer } = this;

        proxyServer.use((req, res, next) => {

            if (req.hostname === 'www.googleapis.com' &&
                req.path === '/youtube/v3/playlistItems' &&
                req.query.playlistId === playlistId) {

                res.append('Access-Control-Allow-Origin', '*');
                res.sendFile(path.resolve(`features/data/${jsonPath}`));

            } else if (req.hostname === 'fake-static-domain') {

                res.sendFile(path.resolve(`features/data/${req.path}`));

            } else next();

        });

    });

});
