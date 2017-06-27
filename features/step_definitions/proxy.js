import { defineSupportCode } from 'cucumber';

defineSupportCode(({ Given }) => {

    Given('a youtube playlist {stringInDoubleQuotes} exists as {stringInDoubleQuotes} from the api', function(jsonPath, playlistId) {

        const { proxyServer } = this;

        proxyServer.on('proxyReq', (proxyRequest, req, res, options) => {

            console.log('PROXY LOL, ');

        });

        // console.log('lul', jsonPath, playlistId, this.proxyServer);

    });

});
