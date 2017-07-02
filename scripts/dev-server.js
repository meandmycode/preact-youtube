/* global process */
/* eslint-disable no-console */
import httpServer from './http-server';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 9001;

httpServer.listen(port, host, err => {

    if (err) {
        return console.log(err);
    }

    console.log(`🚀  Web application is now running at http://${host}:${port}`);
    console.log('');

});
