import { defineSupportCode } from 'cucumber';
import Webdriver from 'selenium-webdriver';
import WebdriverProxy from 'selenium-webdriver/proxy';
import 'chromedriver';

import net from 'net';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import express from 'express';
import { should } from 'chai';

import httpServer from '../../scripts/http-server';
import devices from './devices.json';
import * as proxyConfig from './proxy-tls';

should();

const hostname = process.env.HOST || 'localhost';
const port = process.env.HTTP_PORT || 9001;
const proxyPort = process.env.PROXY_HTTP_PORT || 9888;
const proxyTlsPort = process.env.PROXY_HTTPS_PORT || 9898;

const host = `${hostname}:${port}`;
const baseUri = `http://${host}`;

const interceptorServer = httpProxy.createProxyServer();

const proxyApp = express();

proxyApp.use((req, res, next) => {

    if (req.hostname === hostname) {
        return interceptorServer.web(req, res, { target: baseUri });
    }

    return next();

});

httpServer.listen(port, hostname);

const proxyServer = http.createServer(proxyApp).listen(proxyPort);

https.createServer(proxyConfig, proxyApp).listen(proxyTlsPort);

proxyServer.on('connect', (req, socket) => {

    const relaySocket = net.connect(proxyTlsPort, hostname, () => {

        socket.write(
            'HTTP/1.1 200 Connection Established\r\n' +
            '\r\n',
        );

        relaySocket.pipe(socket);
        socket.pipe(relaySocket);

    });

});

const driver = new Webdriver.Builder()
    .withCapabilities({ [Webdriver.Capability.ACCEPT_SSL_CERTS]: true })
    .forBrowser('chrome')
    .setProxy(WebdriverProxy.manual({ http: `${hostname}:${proxyPort}`, https: `${hostname}:${proxyPort}` }))
    .build();

//

class World {
    baseUri = baseUri;
    driver = driver;
    httpServer = httpServer;
    proxyServer = proxyApp;
    devices = devices;
}

defineSupportCode(({ setWorldConstructor, registerHandler }) => {

    setWorldConstructor(World);

    registerHandler('AfterFeatures', () => driver.close());

});
