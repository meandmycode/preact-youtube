import { defineSupportCode } from 'cucumber';

defineSupportCode(({ Given }) => {

    Given('a youtube playlist {stringInDoubleQuotes} exists as {stringInDoubleQuotes} from the api', function(jsonPath, playlistId) {

        const { proxyServer } = this;

        proxyServer.use((req, res, next) => {

            if (req.hostname === 'www.googleapis.com' && req.path.startsWith('/youtube/v3')) {


            }

        });

        // console.log('lul', jsonPath, playlistId, this.proxyServer);

    });

});
