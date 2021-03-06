/* global process */
import { defineSupportCode } from 'cucumber';
import Webdriver from 'selenium-webdriver';
import WebdriverProxy from 'selenium-webdriver/proxy';
import 'chromedriver';

import cp from 'child_process';
import net from 'net';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import express from 'express';
import chai from 'chai';
import chaiString from 'chai-string';

import devices from './devices.json';
import * as proxyConfig from './proxy';

chai.use(chaiString);
chai.should();

function sleep(time) {
    const stop = new Date().getTime();
    while (new Date().getTime() < stop + time);
}

const appHostname = process.env.APP_HOST || 'localhost';
const appPort = process.env.APP_PORT || 9001;
const proxyPort = process.env.PROXY_HTTP_PORT || 9888;
const proxyTlsPort = process.env.PROXY_HTTPS_PORT || 9898;

const host = `${appHostname}:${appPort}`;
const baseUri = `http://${host}`;

cp.spawn('npm', [
    'start',
    '--',
    `--port=${appPort}`,
    `--proxyHost=${appHostname}`,
    `--proxyPort=${proxyPort}`,
    '--allowInsecureTls=true',
], {
    shell: true,
});

// devnote: this is horrible, but we can't stall cucumber from
// running scenarios and we need a little time for our server
// to start
sleep(1000);

const interceptorServer = httpProxy.createProxyServer();

const createProxy = () => {

    const proxyApp = express();

    proxyApp.use((req, res, next) => {

        if (req.hostname === appHostname) {
            return interceptorServer.web(req, res, { target: baseUri });
        }

        return next();

    });

    const proxyHttpServer = http.createServer(proxyApp);
    const proxyHttpsServer = https.createServer(proxyConfig, proxyApp);

    proxyHttpServer.listen(proxyPort);
    proxyHttpsServer.listen(proxyTlsPort);

    proxyHttpServer.on('connect', (req, socket) => {

        const relaySocket = net.connect(proxyTlsPort, appHostname, () => {

            socket.write(
                'HTTP/1.1 200 Connection Established\r\n' +
                '\r\n',
            );

            relaySocket.pipe(socket);
            socket.pipe(relaySocket);

        });

    });

    proxyApp.quit = () => {
        proxyHttpServer.close();
        proxyHttpsServer.close();
    };

    return proxyApp;

};

const normalizeCapabilities = ({ deviceEmulation, ...etc }) => {

    const chromeOptions = {
        mobileEmulation: deviceEmulation,
        args: ['lang=en'],
    };

    return { browserName: 'chrome', chromeOptions, ...etc };

};

const createDriver = capabilities => new Webdriver.Builder()
    .withCapabilities({ [Webdriver.Capability.ACCEPT_SSL_CERTS]: true, ...normalizeCapabilities(capabilities) })
    .setProxy(WebdriverProxy.manual({ http: `${appHostname}:${proxyPort}`, https: `${appHostname}:${proxyPort}` }))
    .build();

//

class World {
    baseUri = baseUri;
    createProxy = createProxy;
    createDriver = createDriver;
    devices = devices;
}

defineSupportCode(({ setWorldConstructor }) => setWorldConstructor(World));
