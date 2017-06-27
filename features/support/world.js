import { defineSupportCode } from 'cucumber';
import Webdriver from 'selenium-webdriver';
import WebdriverProxy from 'selenium-webdriver/proxy';
import 'chromedriver';
import httpProxy from 'http-proxy';
import httpServer from '../../scripts/http-server';
import devices from './devices.json';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 9001;
const baseUri = `http://${host}:${port}`;

const proxyPort = process.env.PROXY_PORT || 8989;

const proxyServer = httpProxy.createProxyServer({});

//

httpServer.listen(port, host);
proxyServer.listen(proxyPort);

const driver = new Webdriver.Builder()
    .forBrowser('chrome')
    .setProxy(WebdriverProxy.manual({ http: `${host}:${proxyPort}` }))
    .build();

//

class World {
    baseUri = baseUri;
    driver = driver;
    httpServer = httpServer;
    proxyServer = proxyServer;
    devices = devices;
}

defineSupportCode(({ setWorldConstructor }) => setWorldConstructor(World));
