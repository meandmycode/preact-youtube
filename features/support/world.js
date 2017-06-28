import { defineSupportCode } from 'cucumber';
import Webdriver from 'selenium-webdriver';
import WebdriverProxy from 'selenium-webdriver/proxy';
import 'chromedriver';
import httpProxy from 'http-proxy';
import express from 'express';
import httpServer from '../../scripts/http-server';
import devices from './devices.json';

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 9001;
const proxyPort = process.env.PROXY_PORT || 8989;

const host = `${hostname}:${port}`;
const baseUri = `http://${host}`;

const interceptorServer = httpProxy.createProxyServer({});

const proxyServer = express();

proxyServer.use((req, res, next) => {

    if (req.hostname === hostname) {
        return interceptorServer.web(req, res, { target: baseUri });
    }

    return next();

});

//

httpServer.listen(port, hostname);
proxyServer.listen(proxyPort, hostname);

const driver = new Webdriver.Builder()
    .withCapabilities(new Webdriver.Capabilities({ acceptInsecureCerts: true }))
    .forBrowser('chrome')
    .setProxy(WebdriverProxy.manual({ https: `${hostname}:${proxyPort}`, bypxass: [hostname] }))
    .build();

//

class World {
    baseUri = baseUri;
    driver = driver;
    httpServer = httpServer;
    proxyServer = proxyServer;
    devices = devices;
}

defineSupportCode(({ setWorldConstructor, registerHandler }) => {

    setWorldConstructor(World);

    registerHandler('AfterFeatures', () => driver.close());

});
