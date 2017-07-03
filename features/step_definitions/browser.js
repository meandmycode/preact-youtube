import { defineSupportCode } from 'cucumber';

defineSupportCode(({ Given, When, Then, After }) => {

    Given('I have a {string} device', function(deviceType) {

        const { createDriver, driver, devices } = this;

        if (driver) throw new Error('A driver is already running for this scenario');

        const deviceMetrics = devices[deviceType];
        const deviceEmulation = { deviceMetrics };

        this.driver = createDriver({ deviceEmulation });

    });

    When('I navigate to {stringInDoubleQuotes}', async function(path) {

        const { driver, baseUri } = this;

        await driver.get(baseUri + path);

    });

    Then('I see the browser navigates to {stringInDoubleQuotes}', async function(path) {

        const { driver, baseUri } = this;

        const expected = baseUri + path;

        const actual = await driver.getCurrentUrl();

        actual.should.startWith(expected);

    });

    After(async function() {

        const { driver } = this;

        this.driver = null;

        if (driver) await driver.quit();

    });

});
